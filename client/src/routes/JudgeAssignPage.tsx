import { ReactElement, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { uniqBy } from 'remeda'
import { CompetitionCreateHeader } from 'src/components'
import { AppRoute } from 'src/constants/appRoute'
import { tableSchemaJudgeToPairs } from 'src/helpers/tableSchemas/tableSchemaJudgeToPairs'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import {
	fetchCompetitionById,
	fetchCompetitionJudges,
	fetchCompetitionParticipants,
	resetPairJudgeAssignStatus,
	setCompetitionData,
	setPairJudges
} from 'src/store/slices/competitionSlice'
import { updateCompetitionsListCompetition } from 'src/store/slices/competitionsSlice'
import { CompetitionGroupSchema, CompetitionSchema, SetJudgesToPairsSchema } from 'src/types'
import { Accordion, Alert, BottomFixedContainer, Button, Loader, RoundedBorderWrapper, TableBody } from 'src/ui'

export type SelectedJudge = {
	id: string
	pairs: {
		id: string
		judgeId: string
	}[]
}

export const JudgeAssignPage = (): ReactElement => {
	const { competitionId } = useParams()
	const [selectedJudges, setSelectedJudges] = useState<SetJudgesToPairsSchema>()
	const [groups, setGroups] = useState<CompetitionGroupSchema[] | undefined>()
	const [errorInfo, setErrorInfo] = useState<string | undefined>()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const competitionData = useAppSelector(s => s.competition.data)
	const judges = useAppSelector(s => s.competition.judges[competitionId as string])
	const participants = useAppSelector(s => competitionId && s.competition.participants[competitionId])
	const { setPairJudgesError, setPairJudgesSuccess, setPairJudgesPending } = useAppSelector(s => s.competition)

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

		if (!participants) {
			dispatch(fetchCompetitionParticipants(competitionId as string))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const getChosenJudgeId = (pairJudge: string, i: number) => {
		const existingJudgeMatchChosen = judges?.find(({ _id }) => _id === pairJudge)
		if (existingJudgeMatchChosen) {
			return existingJudgeMatchChosen._id
		}
		return judges && judges[i % judges.length]._id
	}

	useEffect(() => {
		setGroups(competitionData?.groups)
	}, [competitionData])

	useEffect(() => {
		const selectedJudgesData = {
			judgesByGroups: groups?.map(({ _id, currentRoundPairs }) => ({
				id: _id,
				pairs: currentRoundPairs?.map((pair, i) => ({
					id: pair._id,
					judgeId: getChosenJudgeId(pair.judge as string, i)
				}))
			})),
			competitionId: competitionId as string
		}
		setSelectedJudges(selectedJudgesData as SetJudgesToPairsSchema)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groups])

	useEffect(() => {
		if (setPairJudgesSuccess) {
			navigate(`/${AppRoute.Competitions}/${competitionId}`)
			dispatch(resetPairJudgeAssignStatus())
			dispatch(
				updateCompetitionsListCompetition({
					competition: competitionData as CompetitionSchema,
					competitionId: competitionId as string
				})
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setPairJudgesSuccess])

	const handleJudgeSelect = (updatedJudgeData: SelectedJudge) => {
		const newSelectJudge = selectedJudges?.judgesByGroups?.map(group => {
			if (group.id === updatedJudgeData.id) {
				group.pairs = updatedJudgeData.pairs
			}
			return group
		})

		const groupIndex = groups?.findIndex(group => group._id === updatedJudgeData.id) as number

		if (groups) {
			const groupsCopy = groups[groupIndex].currentRoundPairs?.slice()
			const updatedGroupData = groupsCopy?.map((pair, i) => {
				return {
					...pair,
					judge: updatedJudgeData.pairs[i].judgeId
				}
			})

			setGroups([
				...groups.slice(0, groupIndex),
				{
					...groups[groupIndex],
					currentRoundPairs: updatedGroupData
				},
				...groups.slice(groupIndex + 1)
			])
		}

		setSelectedJudges({
			competitionId: competitionId as string,
			judgesByGroups: newSelectJudge
		})

		setErrorInfo('')
		newSelectJudge?.forEach(groupInfo => {
			let index = 0
			let amountPairsPassed = 0
			const maxPairs = judges?.length
			const pairsGroupedByJudgesLength = groupInfo.pairs?.reduce<
				{
					id: string
					judgeId: string
				}[][]
			>((acc, pair) => {
				if (!acc[index]) {
					acc[index] = [pair]
				} else {
					acc[index].push(pair)
				}
				amountPairsPassed += 1
				if (amountPairsPassed === maxPairs) {
					amountPairsPassed = 0
					index += 1
				}

				return acc
			}, [])
			pairsGroupedByJudgesLength.forEach(groupedPair => {
				const uniqued = uniqBy(groupedPair, item => item.judgeId)
				if (uniqued.length !== groupedPair.length) {
					const group = groups?.find(g => g._id === groupInfo.id)
					setErrorInfo(
						`There shouldn't be similar judges in a row. Group with gender ${group?.gender}, age ${group?.ageCategory?.from}-${group?.ageCategory?.to}, weight ${group?.weightCategory?.from}-${group?.weightCategory?.to} kg.`
					)
				}
			})
		})
	}

	const handleDoneClick = () => {
		dispatch(setPairJudges(selectedJudges as SetJudgesToPairsSchema))
	}

	const handleBackClick = () => {
		dispatch(
			setCompetitionData({
				...competitionData,
				groups: groups as CompetitionGroupSchema[]
			} as CompetitionSchema)
		)

		navigate(`../${AppRoute.OrdersGroupAssign}`)
	}

	return (
		<main className='container mx-auto grow px-[17px] pt-8 pb-[5.5rem] md:py-9 md:pb-28 xl:pt-14 xl:pl-[7.5rem] xl:pr-[7.5rem]'>
			<CompetitionCreateHeader
				title='Connect judges to pairs 4/4'
				backArrowPath={`../${AppRoute.OrdersGroupAssign}`}
				competitionData={competitionData}
				judges={judges}
			/>
			{groups && (
				<RoundedBorderWrapper classes='py-4 xl:py-7'>
					{groups.map(({ _id: groupId, gender, ageCategory, weightCategory, currentRoundPairs }, i) => (
						<Accordion
							key={groupId}
							classes='last:pb-0'
							isOpenDefault
							title={
								<h3 className='font-bold xl:text-2xl [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-[24px]'>
									<span className='capitalize'>{gender}</span> {ageCategory?.from}-{ageCategory?.to} age,{' '}
									{weightCategory?.from}-{weightCategory?.to}kg
									{currentRoundPairs?.length && (
										<span className='text-zinc-400'>
											{' '}
											{currentRoundPairs?.length} {`pair${currentRoundPairs?.length === 1 ? '' : 's'}`}
										</span>
									)}
								</h3>
							}
						>
							{currentRoundPairs && participants && judges?.length ? (
								<TableBody
									rows={tableSchemaJudgeToPairs({
										tableData: currentRoundPairs,
										participants,
										judges,
										groupId,
										selectedJudges: selectedJudges?.judgesByGroups && selectedJudges?.judgesByGroups[i],
										onSelect: handleJudgeSelect
									})}
								/>
							) : (
								<Loader />
							)}
						</Accordion>
					))}
				</RoundedBorderWrapper>
			)}
			<BottomFixedContainer classes='xl:pl-[7.5rem] xl:pr-[7.5rem]'>
				<div className='flex flex-wrap gap-2.5'>
					<Button type='outlined' onClick={handleBackClick}>
						Previous step
					</Button>
					<Button
						classes='min-w-[8rem] xl:min-w-[15.625rem]'
						onClick={handleDoneClick}
						loading={setPairJudgesPending}
						disabled={!!errorInfo}
					>
						Done
					</Button>
					{setPairJudgesError && <Alert type='error' subtitle={setPairJudgesError} />}
					{errorInfo && <Alert type='error' subtitle={errorInfo} />}
				</div>
			</BottomFixedContainer>
		</main>
	)
}
