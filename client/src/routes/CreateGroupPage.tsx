import { ReactElement, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'
import { SortOrder } from 'src/constants/sortOrder'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import {
	Button,
	BottomFixedContainer,
	Loader,
	RoundedBorderWrapper,
	Accordion,
	TableBody
} from 'src/ui'
import {
	CompetitionRequirements,
	GroupParameters,
	CompetitionCreateHeader,
	ParticipantsList
} from 'src/components'
import {
	fetchCompetitionById,
	fetchCompetitionJudges,
	fetchCompetitionParticipants,
	setCompetitionGroups
} from 'src/store/slices/competitionSlice'
import { ReactComponent as TrashIcon } from 'src/assets/trash.svg'
import { CompetitionRequirementsSchema, UserSchema } from 'src/types'
import { ParticipantsListTable, SortType } from 'src/components/ParticipantsList/ParticipantsList'
import { tableSchemaGroupParticipants } from 'src/helpers/tableSchemas/tableSchemaGroupParticipants'
import { getAge } from 'src/helpers/datetime'
import { sortFunc } from 'src/helpers/sortFunc'

export const CreateGroupPage = (): ReactElement => {
	const { competitionId } = useParams()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const competitionData = useAppSelector(s => s.competition.data)
	const judges = useAppSelector(s => s.competition.judges[competitionId as string])
	const allParticipants = useAppSelector(s => s.competition.participants[competitionId as string])
	const [competitionRequirements, setCompetitionRequirements] = useState<CompetitionRequirementsSchema>()
	const [participants, setParticipants] = useState<ParticipantsListTable>({
		inGroup: [],
		outGroup: []
	})

	if (judges?.length === 0) {
		navigate(`../${AppRoute.JudgeChoice}`)
	}

	useEffect(() => {
		if (!competitionData) {
			dispatch(fetchCompetitionById(competitionId as string))
		}

		if (!judges) {
			dispatch(fetchCompetitionJudges(competitionId as string))
		}
		dispatch(fetchCompetitionParticipants(competitionId as string))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (allParticipants) {
			setParticipants({
				inGroup: allParticipants,
				outGroup: []
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allParticipants])

	const getGroupParameters = (requirementsData: CompetitionRequirementsSchema) => {
		if (allParticipants && requirementsData) {
			const usersData: ParticipantsListTable = {
				inGroup: [],
				outGroup: []
			}
			// returns participants by group parameters filter
			allParticipants.map((participant: UserSchema) => {
				if (participant.gender === requirementsData.gender
					&& getAge(participant.birthDate) as number >= (requirementsData.ageCategory?.from as number)
					&& getAge(participant.birthDate) as number <= (requirementsData.ageCategory?.to as number)
					&& participant.weight >= (requirementsData.weightCategory?.from as number)
					&& participant.weight <= (requirementsData.weightCategory?.to as number)) {
					usersData.inGroup.push(participant)
				} else if (participant.gender === requirementsData.gender) {
					usersData.outGroup.push(participant)
				}

				return usersData
			})
			setParticipants(usersData)
			setCompetitionRequirements(requirementsData)
		}
	}

	const addGroup = () => {
		dispatch(setCompetitionGroups({
			competition: {
				...competitionRequirements,
				allParticipants: participants.inGroup as string[],
				currentRoundNumber: 0
			},
			id: competitionId as string
		}))
	}

	const getGroupParticipants = (participantsIds: string[]): UserSchema[] | undefined => {
		return allParticipants?.reduce((acc, participant) => {
			if (participantsIds.includes(participant._id as string)) {
				acc.push(participant)
			}

			return acc
		}, [] as UserSchema[])
	}

	const handleSort = (sortType: string, sortOrder: string) => {
		const sortFuncArgumentsOrder = (arg1: number, arg2: number) => {
			return sortOrder === SortOrder.ASC ? arg2 - arg1 : arg1 - arg2
		}

		const sortedParticipants: ParticipantsListTable = {
			inGroup: [],
			outGroup: []
		}

		if (sortType === SortType.Name || sortType === SortType.Sex) {
			sortedParticipants.inGroup = [...participants.inGroup].sort((a, b) => sortFunc(a, b, sortType as keyof UserSchema, sortOrder))
			sortedParticipants.outGroup = [...participants.outGroup].sort((a, b) => sortFunc(a, b, sortType as keyof UserSchema, sortOrder))
		} else if (sortType === SortType.Age) {
			sortedParticipants.inGroup = [...participants.inGroup].sort((a, b) => sortFuncArgumentsOrder(new Date(a.birthDate).getFullYear(), new Date(b.birthDate).getFullYear()))
			sortedParticipants.outGroup = [...participants.outGroup].sort((a, b) => sortFuncArgumentsOrder(new Date(a.birthDate).getFullYear(), new Date(b.birthDate).getFullYear()))
		} else {
			sortedParticipants.inGroup = [...participants.inGroup].sort((a, b) => sortFuncArgumentsOrder(a.weight, b.weight))
			sortedParticipants.outGroup = [...participants.outGroup].sort((a, b) => sortFuncArgumentsOrder(a.weight, b.weight))
		}

		setParticipants(sortedParticipants)
	}
	const handleDoneClick = () => {}

	return (
		<main className="container mx-auto grow px-[17px] pt-8 pb-[5.5rem] md:py-9 md:pb-28 xl:pt-14 xl:pl-[7.5rem] xl:pr-[7.5rem]">
			<CompetitionCreateHeader
				title="Create groups 2/4"
				backArrowPath={`../${AppRoute.JudgeChoice}`}
				competitionData={competitionData}
				judges={judges}
			/>
			{competitionData?.requirements && (
				<div className="grid grid-cols-[16rem_auto] gap-5 mb-12 rounded-3xl border border-pale-grey pt-6 pl-6 overflow-hidden">
					<div className="mb-6">
						<GroupParameters
							requirements={competitionData.requirements}
							getGroupParameters={getGroupParameters}
							addGroup={addGroup}
							noParticipants={participants.inGroup.length !== 0}
							classes="mb-[3.125rem]"
						/>
						{competitionData.requirements &&
                            <CompetitionRequirements competitionRequirements={competitionData.requirements}/>}
					</div>
					{allParticipants
						? <ParticipantsList
							participants={participants}
							onSort={handleSort}
							classes="-mr-px"/>
						: <Loader/>
					}
				</div>
			)}
			<h2 className='mb-8 text-heading-3'>Groups</h2>
			{competitionData?.groups?.length !== 0 && (
				<RoundedBorderWrapper classes='py-4 !py-2'>
					{competitionData?.groups?.map(({_id, gender, ageCategory, weightCategory, allParticipants: allParticipantsGroup}) => (
						<Accordion
							key={_id}
							additionalIcon={<TrashIcon className='ml-5'/>}
							title={
								<h3 className='font-bold xl:text-2xl [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-[24px]'>
									<span className='capitalize'>{gender}</span> {ageCategory?.from}-{ageCategory?.to} age,{' '}
									{weightCategory?.from}-{weightCategory?.to}kg
									{allParticipantsGroup?.length && (
										<span className='text-zinc-400'>
											{' '}
											{allParticipantsGroup?.length} {`pair${allParticipantsGroup?.length === 1 ? '' : 's'}`}
										</span>
									)}
								</h3>
							}
						>
							{allParticipants
								? <TableBody
									rows={tableSchemaGroupParticipants(getGroupParticipants(allParticipantsGroup as string[]) as UserSchema[])}
								/>
								: <Loader/>
							}
						</Accordion>
					)) }
				</RoundedBorderWrapper>
			)}
			<BottomFixedContainer classes="xl:pl-[7.5rem] xl:pr-[7.5rem]">
				<div className="flex flex-wrap gap-2.5">
					<Button type="outlined" onClick={() => navigate(`../${AppRoute.JudgeChoice}`)}>
						Previous step
					</Button>
					<Button
						classes="min-w-[8rem] xl:min-w-[15.625rem]"
						onClick={handleDoneClick}
						// loading={pairJudgesAssignPending}
					>
						Done
					</Button>
					{/* {pairJudgesAssignError && <Alert type='error' subtitle={pairJudgesAssignError} />} */}
				</div>
			</BottomFixedContainer>
		</main>
	)
}
