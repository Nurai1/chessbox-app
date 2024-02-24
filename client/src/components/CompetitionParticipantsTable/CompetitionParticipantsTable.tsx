import { FC, MutableRefObject } from 'react'
import { useParams } from 'react-router-dom'
import { getAge, getFormattedDate } from 'src/helpers/datetime'
import { getGroupPairsLen } from 'src/helpers/getGroupPairsLen'
import { getTimeTuplePlusMinutes } from 'src/helpers/getTimeTuplePlusMinutes'
import { PairType, tableSchemaPairs } from 'src/helpers/tableSchemas/tableSchemaPairs'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { launchNextGroupRound } from 'src/store/slices/competitionSlice'
import {
	AgeCategorySchema,
	ChooseWinnerType,
	CompetitionSchema,
	ParticipantSchema,
	UserSchema,
	WeightCategorySchema
} from 'src/types'
import { Accordion, Button, Loader, TableBody } from 'src/ui'
import { TIME_FOR_PAIR } from '../../constants/time'

const getStartPointTimeTuple = (competitionData: CompetitionSchema) => {
	if (!competitionData.started && competitionData.baseDate) {
		return Number(new Date(competitionData.baseDate)) - Date.now() > 0
			? getFormattedDate(competitionData.baseDate, 'HH:mm').split(':')
			: getFormattedDate(new Date().toISOString(), 'HH:mm').split(':')
	}
	if (competitionData.started && competitionData.baseDate) {
		return getFormattedDate(competitionData.baseDate, 'HH:mm').split(':')
	}

	return []
}

type CompetitionParticipantsTablePropsType = {
	competitionData: CompetitionSchema
	participants: ParticipantSchema[]
	judges: UserSchema[]
	authorizedUser?: UserSchema | null
	currentUserPairRef?: MutableRefObject<undefined | { pair?: PairType; startTime: string }>
	isJudgeCompetitionPage?: boolean
	onCallPairPreparation?: (groupId: string, pairId: string) => void
	isBreakTime?: boolean
	onCallUpTimer?: (pairId: string) => void
	maxPairs?: number
	currentPairs?: string[]
	onChooseWinner?: (data?: Record<string, ChooseWinnerType>) => void
	defineWinnerPending?: boolean
	onDefineWinner?: (pairId: string) => void
}

export const CompetitionParticipantsTable: FC<CompetitionParticipantsTablePropsType> = ({
	competitionData,
	participants,
	judges,
	authorizedUser,
	currentUserPairRef,
	isJudgeCompetitionPage,
	...rest
}) => {
	const dispatch = useAppDispatch()
	const { competitionId } = useParams()
	const { launchNextGroupRoundPending } = useAppSelector(s => s.competition)
	const currentGroupIndex = competitionData.groups?.findIndex(group => group.isCompleted === false)
	const startPointTimeTuple = getStartPointTimeTuple(competitionData)

	const groupsPairsLen = competitionData?.groups?.map(group =>
		getGroupPairsLen({
			passedPairsLen: group.passedPairs?.length ?? 0,
			currentPairsLen: group.currentRoundPairs?.length ?? 0,
			nextRoundParticipantsLen: group.nextRoundParticipants?.length ?? 0
		})
	)

	const getTitle = ({
		gender,
		ageCategory,
		weightCategory,
		pairsBeforeLen,
		// for nextRoundParticipants calculation
		currentRoundPairsLen = 0,
		competitionJudgesLen,
		classes
	}: {
		pairsBeforeLen: number
		competitionJudgesLen: number
		currentRoundPairsLen?: number
		gender: string
		ageCategory: AgeCategorySchema
		weightCategory: WeightCategorySchema
		classes?: string
	}) => (
		<h3 className={`font-bold xl:text-2xl [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-[24px] ${classes}`}>
			{getTimeTuplePlusMinutes(
				startPointTimeTuple,
				((pairsBeforeLen + currentRoundPairsLen) * TIME_FOR_PAIR) / competitionJudgesLen +
					((pairsBeforeLen + currentRoundPairsLen) % competitionJudgesLen === 0
						? 0
						: TIME_FOR_PAIR / competitionJudgesLen)
			).join(':')}
			<span className='ml-3 inline-block capitalize'>{gender}</span> {ageCategory?.from}- {ageCategory?.to} age,{' '}
			{weightCategory?.from}-{weightCategory?.to}kg
		</h3>
	)

	const noPairsForFightInGroup = competitionData.groups?.reduce(
		(acc, group) => {
			// only pair.passed do not work because flaky 'defineWinner' endpoint set passed 50/50
			if (group.currentRoundPairs?.every(pair => pair.winner || pair.passed)) {
				return {
					...acc,
					[group._id as string]: true
				}
			}
			return acc
		},
		{} as Record<string, boolean>
	)

	const handleLaunchNextGroupRound = (groupId: string) => {
		dispatch(launchNextGroupRound({ competitionId: competitionId as string, groupId }))
	}

	return (
		<div className='xl:px[50px] flex grow flex-col lg:rounded-3xl lg:border lg:border-[#DADADA] lg:px-[40px] lg:pt-[33px] xl:pt-9'>
			{competitionData.groups?.map(
				(
					{
						_id,
						gender,
						ageCategory,
						weightCategory,
						currentRoundPairs,
						passedPairs,
						nextRoundParticipants,
						isCompleted
					},
					groupIndex
				) => {
					const currentRoundPairsLen = currentRoundPairs?.length ?? 0
					const competitionJudgesLen = competitionData?.judges?.length ?? 1

					let pairsBeforeLen = passedPairs?.length ?? 0
					for (let i = 0; i < groupIndex; i += 1) {
						const groupPairsLen = groupsPairsLen?.[i].length ?? 0
						pairsBeforeLen += groupPairsLen + (groupsPairsLen?.[i].passedGroup ? groupPairsLen % 2 : 0)
					}

					pairsBeforeLen =
						pairsBeforeLen % competitionJudgesLen === 0
							? pairsBeforeLen
							: pairsBeforeLen + (pairsBeforeLen % competitionJudgesLen)

					const nextRoundParticipantsStartTime = getTimeTuplePlusMinutes(
						startPointTimeTuple,
						((pairsBeforeLen + currentRoundPairsLen) * TIME_FOR_PAIR) / competitionJudgesLen
					).join(':')

					const tableData = () => (
						// eslint-disable-next-line react/jsx-no-useless-fragment
						<>
							{currentRoundPairs ? (
								<>
									<TableBody
										rows={tableSchemaPairs({
											tableData: currentRoundPairs,
											participants,
											judges,
											startTimeTuple: getTimeTuplePlusMinutes(
												startPointTimeTuple,
												(pairsBeforeLen * TIME_FOR_PAIR) / competitionJudgesLen
											),
											currentUser: { currentUserPairRef, authorizedUserId: authorizedUser?._id },
											breakTime: competitionData?.breakTime,
											groupIndex,
											groupId: _id,
											currentGroupIndex,
											isJudgeCompetitionPage,
											lastPairIndex: (passedPairs?.length ?? 0) - currentRoundPairs.filter(p => p.passed).length,
											...rest
										})}
									/>
									{isJudgeCompetitionPage && noPairsForFightInGroup && noPairsForFightInGroup[_id as string] && (
										<Button
											classes='mb-2.5 w-[14.25rem]'
											loading={launchNextGroupRoundPending}
											onClick={() => handleLaunchNextGroupRound(_id as string)}
										>
											Create new pairs
										</Button>
									)}
									{!!nextRoundParticipants?.length &&
										getTitle({
											gender,
											ageCategory,
											weightCategory,
											pairsBeforeLen,
											currentRoundPairsLen,
											competitionJudgesLen,
											classes: 'mb-4 md:mb-8'
										})}
									{nextRoundParticipants &&
										nextRoundParticipants?.map((participantId, participantIdx) => {
											const nextRoundParticipant = participants
												? participants.find(({ _id: pId }) => pId === participantId)
												: null

											if (currentUserPairRef && participantId === authorizedUser?._id) {
												currentUserPairRef.current = {
													startTime: nextRoundParticipantsStartTime,
													pair: {
														whiteParticipant: participantId,
														whiteParticipantData: nextRoundParticipant ?? undefined
													}
												}
											}

											return (
												<div key={nextRoundParticipant?._id} className='flex h-20 w-full items-center py-3 md:pr-6'>
													<div className='h-full w-[50px] font-bold'>{participantIdx + 1}</div>
													<div className='flex h-full grow flex-col'>
														<div className='mb-[7px] text-sm text-black xl:text-base'>
															{nextRoundParticipant?.fullName}
														</div>
														<div className='text-[#6C6A6C]'>
															{getAge(nextRoundParticipant?.birthDate as string)} age, {nextRoundParticipant?.weight} kg
														</div>
													</div>
													<div>
														<span className='text-sm uppercase text-[#4565D9] md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 xl:col-start-3 xl:col-end-4 xl:row-auto xl:text-base xl:font-bold'>
															WAITING
														</span>
													</div>
												</div>
											)
										})}
								</>
							) : (
								<Loader />
							)}
						</>
					)

					return (
						<div key={_id} className={`${isCompleted ? 'hidden' : ''}`}>
							{isJudgeCompetitionPage && (
								// eslint-disable-next-line react/jsx-no-useless-fragment
								<>
									{currentGroupIndex === groupIndex ? (
										<>
											{getTitle({
												gender,
												ageCategory,
												weightCategory,
												pairsBeforeLen,
												competitionJudgesLen,
												classes: 'mb-4 md:mb-8'
											})}
											{tableData()}
										</>
									) : (
										<Accordion
											title={getTitle({ gender, ageCategory, weightCategory, pairsBeforeLen, competitionJudgesLen })}
											isOpenDefault={currentGroupIndex === groupIndex}
											classes=' border-t '
										>
											{tableData()}
										</Accordion>
									)}
								</>
							)}
							{!isJudgeCompetitionPage && (
								<>
									{getTitle({
										gender,
										ageCategory,
										weightCategory,
										pairsBeforeLen,
										competitionJudgesLen,
										classes: 'mb-4 md:mb-8'
									})}
									{tableData()}
								</>
							)}
						</div>
					)
				}
			)}
		</div>
	)
}
