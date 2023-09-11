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
	TableBody,
	Alert
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
	setCompetitionGroups,
	deleteCompetitionGroup,
	resetCompetitionGroupsStatus,
	resetDeleteCompetitionGroupStatus
} from 'src/store/slices/competitionSlice'
import { ReactComponent as TrashIcon } from 'src/assets/trash.svg'
import { CompetitionRequirementsSchema, UserSchema, ParticipantSchema } from 'src/types'
import { ParticipantsListTable, SortType } from 'src/components/ParticipantsList/ParticipantsList'
import { tableSchemaGroupParticipants } from 'src/helpers/tableSchemas/tableSchemaGroupParticipants'
import { getAge } from 'src/helpers/datetime'
import { sortFunc } from 'src/helpers/sortFunc'
import { AlertPropTypes } from 'src/ui/Alert/Alert'

type AlertType = {
	show: boolean
} & AlertPropTypes

const overlapError = {
	hasError: false,
	stopWatching: false
}

let showButtonClicked = false

export const CreateGroupPage = (): ReactElement => {
	const { competitionId } = useParams()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const competitionData = useAppSelector(s => s.competition.data)
	const judges = useAppSelector(s => s.competition.judges[competitionId as string])
	const allParticipantsData = useAppSelector(s => s.competition.participants[competitionId as string])
	const addGroupPending = useAppSelector(s => s.competition.groupAddPending)
	const addGroupSuccess = useAppSelector(s => s.competition.groupAddSuccess)
	const addGroupError = useAppSelector(s => s.competition.groupAddError)
	const deleteGroupPending = useAppSelector(s => s.competition.groupDeletePending)
	const deleteGroupSuccess = useAppSelector(s => s.competition.groupDeleteSuccess)
	const deleteGroupError = useAppSelector(s => s.competition.groupDeleteError)
	const [groupParameters, setGroupParameters] = useState<CompetitionRequirementsSchema>()
	const [deletingGroupId, setDeletingGroupId] = useState<string>()
	const [allParticipants, setAllParticipants] = useState<ParticipantSchema[]>()
	const [participants, setParticipants] = useState<ParticipantsListTable>({
		inGroup: [],
		outGroup: []
	})
	const [alertData, setAlertData] = useState<AlertType>({ show: false , type: 'success'})

	if (judges?.length === 0) {
		navigate(`../${AppRoute.JudgeChoice}`)
	}

	const addGroupInfo = (participantsData: ParticipantSchema[]) => {
		if (competitionData) {
			const participantsGroup = [...participantsData]
			participantsData.forEach((participant, i) => {
				competitionData.groups?.forEach(group => {
					if (group.allParticipants?.includes(participant._id as string)) {
						participantsGroup[i] = {
							...participant,
							group: `${group.gender}, ${group.ageCategory?.from}-${group.ageCategory?.to}, ${group.weightCategory?.from}-${group.weightCategory?.to} kg`
						}
					}
				})
			})
			setAllParticipants(participantsGroup)
			return participantsGroup
		}
		return null
	}

	const getFilterCondition = (participant: UserSchema, filterParameters: CompetitionRequirementsSchema) => {
		return participant.gender === filterParameters?.gender
			&& getAge(participant.birthDate) as number >= (filterParameters.ageCategory?.from as number)
			&& getAge(participant.birthDate) as number <= (filterParameters.ageCategory?.to as number)
			&& participant.weight >= (filterParameters.weightCategory?.from as number)
			&& participant.weight <= (filterParameters.weightCategory?.to as number)
	}

	const filterUsers = (participantsList: ParticipantSchema[], filterParameters: CompetitionRequirementsSchema
	) => {
		if (filterParameters) {
			return participantsList.reduce((acc:ParticipantsListTable, participant: UserSchema) => {
				if (getFilterCondition(participant, filterParameters)) {
					acc.inGroup.push(participant)
				} else if (participant.gender === filterParameters.gender) {
					acc.outGroup.push(participant)
				}
				return acc
			}, { inGroup: [], outGroup: [] })
		}
		return { inGroup: participantsList, outGroup: [] }
	}

	const removeUserGroupInfo = (groupId: string) => {
		if (competitionData?.groups && allParticipants) {
			const group = competitionData.groups.find(groupData => groupData._id === groupId)
			const updatedParticipants = allParticipants.reduce((acc: ParticipantSchema[], participant) => {
				if (group?.allParticipants?.includes(participant._id as string)) {
					acc.push({
						...participant,
						group: ''
					})
				} else {
					acc.push(participant)
				}
				return acc
			}, [])

			return updatedParticipants
		}
		return null
	}

	const setOverlapError = (participantsOverlap: ParticipantSchema[], filterParameters: CompetitionRequirementsSchema) => {
		if (filterParameters) {
			const participantsWithOverlap = participantsOverlap.map((participant, i) => {
				if (getFilterCondition(participant, filterParameters)) {
					participantsOverlap[i] = {
						...participant,
						groupOverlap: true
					}
					if (!overlapError.stopWatching) {
						overlapError.hasError = true
						overlapError.stopWatching = true
					}
					return participant
				}
				return participant
			})
			return participantsWithOverlap
		}
		return null
	}

	const getParticipantsByParameters = (filterParameters: CompetitionRequirementsSchema) => {
		if (allParticipants) {
			const users = filterUsers(allParticipants, filterParameters)
			overlapError.hasError = false
			overlapError.stopWatching = false
			// adds overlap error to participants list
			competitionData?.groups?.map(group => {
				const filterParametersOverlap: CompetitionRequirementsSchema = {
					ageCategory: group.ageCategory,
					weightCategory: group.weightCategory,
					gender: group.gender
				}

				return setOverlapError(users.inGroup, filterParametersOverlap)
			})
			setParticipants(users)
		}
	}

	const getParticipantsByFilter = (filterParameters: CompetitionRequirementsSchema) => {
		showButtonClicked = true
		setGroupParameters(filterParameters)
		getParticipantsByParameters(filterParameters)
	}

	const handleDeleteGroup = (groupId: string, competitionUniqId: string) => {
		setDeletingGroupId(groupId)
		dispatch(deleteCompetitionGroup({groupId: {groupId}, id: competitionUniqId}))
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

		const sortedParticipants: ParticipantsListTable = { inGroup: [], outGroup: [] }

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

	const handleAddGroup = () => {
		if (participants.inGroup.length) {
			dispatch(setCompetitionGroups({
				competition: {
					...groupParameters,
					gender: groupParameters?.gender as string,
					allParticipants: participants.inGroup.map(participant => participant._id) as string[],
					currentRoundNumber: 0 // todo make optional
				},
				id: competitionId as string
			}))
		}
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
		if (allParticipantsData) {
			setParticipants({
				inGroup: addGroupInfo(allParticipantsData) as ParticipantSchema[],
				outGroup: []
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allParticipantsData, addGroupSuccess])

	useEffect(() => {
		// updates participants after group deleted
		if (groupParameters) {
			getParticipantsByParameters(groupParameters)
			const updatedGroupInfoParticipants = removeUserGroupInfo(deletingGroupId as string)
			setAllParticipants(updatedGroupInfoParticipants as ParticipantSchema[])
		} else {
			const updatedGroupInfoParticipants = removeUserGroupInfo(deletingGroupId as string)
			const participantsGroupSplitted  = filterUsers(updatedGroupInfoParticipants as ParticipantSchema[], groupParameters)
			setAllParticipants(updatedGroupInfoParticipants as ParticipantSchema[])
			setParticipants(participantsGroupSplitted)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deleteGroupSuccess, deletingGroupId])

	useEffect(() => {
		if (addGroupSuccess) {
			showButtonClicked = false
			setAlertData({show: true, title: 'Group added', type: 'success'})
			setGroupParameters(undefined)
			dispatch(resetCompetitionGroupsStatus())
		}

		if (addGroupError) {
			setAlertData({show: true, title: 'Group add failed', subtitle: addGroupError, type: 'error'})
			dispatch(resetCompetitionGroupsStatus())
		}

		if (deleteGroupSuccess) {
			setAlertData({show: true, title: 'Group deleted', type: 'success'})
			dispatch(resetDeleteCompetitionGroupStatus())
		}

		if (deleteGroupError) {
			setAlertData({show: true, title: 'Group delete failed', subtitle: deleteGroupError, type: 'error'})
			dispatch(resetDeleteCompetitionGroupStatus())
		}

		setTimeout(() => setAlertData({show: false, type: alertData.type, subtitle: ''}), 3000)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [addGroupSuccess, addGroupError, deleteGroupSuccess, deleteGroupError])

	return (
		<main className="container mx-auto grow px-[17px] pt-8 pb-[5.5rem] md:py-9 md:pb-28 xl:pt-14 xl:pl-[7.5rem] xl:pr-[7.5rem]">
			<Alert title={alertData.title} type={alertData.type} classes={`fixed -right-56 w-56 transition-[right] duration-300 ${alertData.show && 'right-8'}`} />
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
							getGroupParameters={getParticipantsByFilter}
							addGroup={handleAddGroup}
							disableAddGroupBtn={participants.inGroup?.length === 0 ||  overlapError.hasError || !showButtonClicked}
							addGroupRequestPending={addGroupPending}
							resetFilterTrigger={addGroupSuccess}
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
							additionalIcon={
								<button
									onClick={() => {handleDeleteGroup(_id as string, competitionId as string)}}
									className={`ml-5  w-[1.9375] h-[1.9375] hover:opacity-70 transition ${deleteGroupPending && 'pointer-events-none'}`}
									type='button'>
									{deleteGroupPending && _id === deletingGroupId
										? <Loader ringClasses='!w-[1.9375rem] !h-[1.9375rem] !border-2'/>
										: <TrashIcon/>
									}
								</button>
							}
							title={
								<h3 className='font-bold xl:text-2xl [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-[24px]'>
									<span className='capitalize'>{gender}</span> {ageCategory?.from}-{ageCategory?.to} age,{' '}
									{weightCategory?.from}-{weightCategory?.to} kg
									<span className='text-zinc-400'> {allParticipantsGroup?.length}</span>
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
			{competitionData?.groups?.length === 0 && <p>No groups created</p>}
			<BottomFixedContainer classes="xl:pl-[7.5rem] xl:pr-[7.5rem]">
				<div className="flex flex-wrap gap-2.5">
					<Button type="outlined" onClick={() => navigate(`../${AppRoute.JudgeChoice}`)}>
						Previous step
					</Button>
					<Button
						classes="min-w-[8rem] xl:min-w-[15.625rem]"
						onClick={() => {
							if (competitionData?.groups?.length) {
								navigate(`../${AppRoute.OrdersGroupAssign}`)
							}
						}}
						disabled={competitionData?.groups?.length === 0}
					>
						Done
					</Button>
				</div>
			</BottomFixedContainer>
		</main>
	)
}
