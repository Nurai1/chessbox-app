import { MutableRefObject, useState } from 'react'
import { useAppSelector } from 'src/hooks/redux'
import { ReactComponent as WhatsappIcon } from 'src/assets/whatsapp.svg'
import { ReactComponent as GoldMedalIcon } from 'src/assets/medal-gold.svg'
import { CompetitionSchema, PairSchema, UserSchema } from 'src/types'
import { getAge, localTZName } from 'src/helpers/datetime'
import { Button, CallUpTimer, CallUpButton, CheckboxAndRadioButton } from 'src/ui'
import { ChooseWinnerType } from 'src/routes/JudgeCompetitionPage'
import { getTimeTuplePlusMinutes } from 'src/helpers/getTimeTuplePlusMinutes'

export type PairType = {
	blackParticipantData?: UserSchema
	whiteParticipantData?: UserSchema
	judgeData?: UserSchema
} & PairSchema

export const TableSchemaPairs = ({
	tableData,
	participants,
	judges,
	startTimeTuple,
	currentUser,
	breakTime,
	isJudgeCompetitionPage,
	maxPairs,
	groupIndex,
	groupId,
	onCallPairPreparation,
	onCallUpTimer,
	currentPairs,
	onChooseWinner,
	currentGroupIndex
}: {
	tableData: PairSchema[]
	participants: UserSchema[]
	judges: UserSchema[]
	startTimeTuple: string[]
	currentUser?: {
		currentUserPairRef?: MutableRefObject<undefined | { pair?: PairType; startTime: string }>
		authorizedUserId?: string
	}
	breakTime?: CompetitionSchema['breakTime']
	isJudgeCompetitionPage?: boolean
	maxPairs?: number
	groupIndex?: number
	groupId?: string
	onCallPairPreparation?: (groupId: string, pairId: string) => void
	onCallUpTimer?: (pairId: string) => void
	currentPairs?: string[]
	onChooseWinner?: (data: ChooseWinnerType) => void
	currentGroupIndex?: number 
}) => {
	const [competitionResult, setCompetitionResult] = useState<Record<string, ChooseWinnerType>>()
	const { callPairPreparationPending, defineWinnerPending } = useAppSelector(s => s.competition)

	const participantsData = tableData.reduce((acc, pair) => {
		const blackParticipantData = participants.find(({ _id }) => pair.blackParticipant === _id)
		const whiteParticipantData = participants.find(({ _id }) => pair.whiteParticipant === _id)
		const judgeData = judges.find(({ _id }) => pair.judge === _id)

		return [
			...acc,
			{
				...pair,
				blackParticipantData,
				whiteParticipantData,
				judgeData
			}
		]
	}, [] as PairType[])

	const statusStyle =
		'uppercase text-sm md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 xl:row-auto xl:col-start-3 xl:col-end-4 xl:text-base xl:font-bold text-right md:pr-6'

	return participantsData.map((pair, i) => {
		const currentPairTime = getTimeTuplePlusMinutes(
			startTimeTuple,
			(i % judges.length === 0 ? (i * 10) / judges.length : ((i - (i % judges.length)) * 10) / judges.length) +
				(breakTime?.minutes ?? 0)
		).join(':')

		if (
			currentUser?.currentUserPairRef && pair.blackParticipant === currentUser.authorizedUserId ||
			currentUser?.currentUserPairRef && pair.whiteParticipant === currentUser?.authorizedUserId
		)
			currentUser.currentUserPairRef.current = {
				pair,
				startTime: currentPairTime
			}
		const isTimerOver = () => {
			if (onCallUpTimer && pair.calledForPreparation) {
				onCallUpTimer(pair._id as string)
			}
		}

		const handleCallPairPreparation = () => {
			if (onCallPairPreparation) {
				onCallPairPreparation(groupId as string, pair._id as string)
			}
		}

		const handleWinnerIdChoose = (value?: string, name?: string) => {
			setCompetitionResult({
				...competitionResult, 
				[name as string]: {
					groupId: groupId as string,
					pairId: pair._id as string,
					winnerId: value,
					loserId: value === pair.blackParticipant ? pair.whiteParticipant : pair.blackParticipant
				} 
			})
		}

		const handleWinnerChoose = () => {
			if (onChooseWinner && competitionResult) {
				onChooseWinner(competitionResult[pair._id as string])
			}
		}

		const currentFightingGroupIndex = currentGroupIndex === groupIndex
		const bothParticipantsDisqualified = pair.disqualified?.blackParticipant && pair.disqualified?.whiteParticipant
		const oneOfParticipantsDisqualified = pair.disqualified?.blackParticipant || pair.disqualified?.whiteParticipant
		const bothParticipantsAccepted = pair.acceptedForFight?.blackParticipant && pair.acceptedForFight?.whiteParticipant
		const oneOfParticipantsNotAccepted =
			!pair.acceptedForFight?.blackParticipant || !pair.acceptedForFight?.whiteParticipant
		const showCallupButton = isJudgeCompetitionPage && !pair.calledForPreparation && currentFightingGroupIndex && !pair.passed
		const showCallUpTimer =
			pair.calledForPreparation && isJudgeCompetitionPage && !bothParticipantsAccepted && !oneOfParticipantsDisqualified
		const showWinnerButton =
			(isJudgeCompetitionPage && !bothParticipantsDisqualified && oneOfParticipantsDisqualified && !pair.winner) ||
			(isJudgeCompetitionPage && !bothParticipantsDisqualified && bothParticipantsAccepted && !pair.winner)
		const finished = pair.winner || bothParticipantsDisqualified
		const inProgress = pair.acceptedForFight?.blackParticipant && pair.acceptedForFight?.whiteParticipant && !pair.winner 
		const waitingCompetitonPage =
			oneOfParticipantsNotAccepted &&
			!pair.winner &&
			!pair.calledForPreparation &&
			!isJudgeCompetitionPage &&
			!bothParticipantsDisqualified
		const waitingJudgeCompetitonPage = isJudgeCompetitionPage && !pair.calledForPreparation && !currentFightingGroupIndex

		const disableCallUpButton = Boolean(maxPairs && currentPairs && maxPairs <= currentPairs?.length)

		return {
			cells: [
				{
					node: <span>{i + 1}</span>,
					classes: 'max-w-[20px] text-base xl:font-bold xl:max-w-[50px]'
				},
				{
					node: (
						<div className='grid w-full grid-cols-[1fr_80px] gap-[14px] lg:grid-cols-[1fr_110px] lg:gap-[28px] xl:grid-cols-[25%_50%_15%] xl:gap-[5%]'>
							<div className='md:col-start-1 md:col-end-3 xl:col-auto'>
								<p className='gri mb-[6px] text-base text-black xl:font-bold'>
									{currentPairTime} ({localTZName})
								</p>
								<a
									href={`https://wa.me/${pair.judgeData?.socialNetworks?.whatsup}`}
									target='_blank'
									rel='noreferrer'
									className='inline-flex gap-[8px] text-xs transition hover:opacity-70 xl:text-base'
								>
									<WhatsappIcon className='h-4 w-4 xl:h-6 xl:w-6' />
									Judge: {pair.judgeData?.fullName}
								</a>
							</div>
							{inProgress && !isJudgeCompetitionPage && (
								<div className={`text-[#FB9F16] ${statusStyle}`}>IN PROGRESS</div>
							)}
							{finished && <div className={`text-[#6DDA64] ${statusStyle}`}>FINISHED</div>}
							{waitingCompetitonPage && <div className={`text-[#4565D9] ${statusStyle}`}>WAITING</div>}
							{waitingJudgeCompetitonPage && <div className={`text-[#4565D9] ${statusStyle}`}>WAITING</div>}
							<div className='col-start-1 col-end-3 flex justify-between md:col-end-2 xl:col-start-2 xl:col-end-3 xl:row-start-1 xl:row-end-2'>
								<div className='flex w-[45%]'>
									<div>
										{pair.acceptedForFight?.blackParticipant && isJudgeCompetitionPage && !pair.winner ? (
											<CheckboxAndRadioButton
												name={pair._id as string}
												value={pair.blackParticipant}
												type='radio'
												title={pair.blackParticipantData?.fullName}
												classes='mb-2 -ml-8'
												onChange={handleWinnerIdChoose}
												checked={competitionResult?.[pair._id as string]?.winnerId === pair.blackParticipantData?._id}
											/>
										) : (
											<p className='mb-2 text-sm text-black xl:text-base'>{pair.blackParticipantData?.fullName}</p>
										)}

										<p className='text-xs xl:text-base'>
											{getAge(pair.blackParticipantData?.birthDate as string)} age, {pair.blackParticipantData?.weight}{' '}
											kg
										</p>
										{pair.disqualified?.blackParticipant && <p className='mt-1 text-error-red'>Disqualification</p>}
									</div>
									{pair.winner === pair.blackParticipant && <GoldMedalIcon className='ml-2.5 w-5 h-6'/>}
								</div>
								<span className='mx-[2%] w-[6%] text-sm text-black xl:text-base'>VS</span>
								<div className='flex w-[45%]'>
									<div className='flex ml-auto w-fit xl:ml-10'>
										<div>
											{pair.acceptedForFight?.whiteParticipant && isJudgeCompetitionPage && !pair.winner ? (
												<CheckboxAndRadioButton
													name={pair._id as string}
													value={pair.whiteParticipant}
													type='radio'
													title={pair.whiteParticipantData?.fullName}
													classes='mb-2 -ml-8'
													onChange={handleWinnerIdChoose}
													checked={competitionResult?.[pair._id as string]?.winnerId  === pair.whiteParticipantData?._id}
												/>
											) : (
												<p className='mb-2 text-sm text-black xl:text-base'>{pair.whiteParticipantData?.fullName}</p>
											)}
											<p className=' text-xs xl:text-base'>
												{getAge(pair.whiteParticipantData?.birthDate as string)} age,{' '}
												{pair.whiteParticipantData?.weight} kg
											</p>
											{pair.disqualified?.whiteParticipant && <p className='mt-1 text-error-red'>Disqualification</p>}
										</div>
										{pair.winner === pair.whiteParticipant && <GoldMedalIcon className='ml-2.5 w-5 h-6'/>}
									</div>
								</div>
							</div>
							{showCallupButton && (
								<CallUpButton
									onCallPairPreparation={handleCallPairPreparation}
									breakTime={Boolean(breakTime)}
									callPairPreparationPending={callPairPreparationPending}
									disable={disableCallUpButton}
								/>
							)}
							{showCallUpTimer && <CallUpTimer onTimeOver={isTimerOver} minutes={1} seconds={59} id={pair._id}/>}
							{onChooseWinner && showWinnerButton && <Button onClick={handleWinnerChoose} loading={defineWinnerPending}>Winner</Button>}
						</div>
					),
					classes: 'pl-0'
				}
			]
		}
	})
}
