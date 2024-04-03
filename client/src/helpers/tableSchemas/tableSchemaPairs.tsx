import { findLastIndex } from 'remeda'
import { MutableRefObject } from 'react'
import { ReactComponent as WhatsappIcon } from 'src/assets/whatsapp.svg'
import { ChooseWinner } from 'src/components'
import { localTZName } from 'src/helpers/datetime'
import { getTimeTuplePlusMinutes } from 'src/helpers/getTimeTuplePlusMinutes'
import { ChooseWinnerType, CompetitionSchema, PairSchema, UserSchema } from 'src/types'
import { Button, CallUpButton } from 'src/ui'
import { TIME_FOR_PAIR } from '../../constants/time'

export type PairType = {
	blackParticipantData?: UserSchema
	whiteParticipantData?: UserSchema
	judgeData?: UserSchema
} & PairSchema

export const tableSchemaPairs = ({
	tableData,
	participants,
	judges,
	startTimeTuple,
	currentUser,
	breakTime,
	isJudgeCompetitionPage,
	groupIndex,
	groupId,
	onCallPairPreparation,
	callPairPreparationPending,
	onChooseWinner,
	currentGroupIndex,
	defineWinnerPending,
	onDefineWinner,
	firstPairOrder = 0
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
	callPairPreparationPending?: boolean
	groupIndex?: number
	groupId?: string
	onCallPairPreparation?: (groupId: string, pairId: string, whiteUserId: string, blackUserId: string) => void
	onChooseWinner?: (data?: Record<string, ChooseWinnerType>) => void
	currentGroupIndex?: number
	defineWinnerPending?: boolean
	onDefineWinner?: (pairId: string) => void
	firstPairOrder?: number
}) => {
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
	const lastCompletedPairIndex = findLastIndex(participantsData, pair => !!pair.winner)

	return participantsData.map((pair, i) => {
		const currentPairTime = getTimeTuplePlusMinutes(
			startTimeTuple,
			i % judges.length === 0
				? (i * TIME_FOR_PAIR) / judges.length
				: ((i - (i % judges.length)) * TIME_FOR_PAIR) / judges.length
		).join(':')

		if (
			(currentUser?.currentUserPairRef && pair.blackParticipant === currentUser.authorizedUserId) ||
			(currentUser?.currentUserPairRef && pair.whiteParticipant === currentUser?.authorizedUserId)
		)
			currentUser.currentUserPairRef.current = {
				pair,
				startTime: currentPairTime
			}

		const handleCallPairPreparation = () => {
			if (
				onCallPairPreparation &&
				groupId &&
				pair._id &&
				pair.whiteParticipantData?._id &&
				pair.blackParticipantData?._id
			) {
				onCallPairPreparation(groupId, pair._id, pair.whiteParticipantData._id, pair.blackParticipantData._id)
			}
		}

		const currentFightingGroupIndex = currentGroupIndex === groupIndex
		const bothParticipantsDisqualified = pair.disqualified?.blackParticipant && pair.disqualified?.whiteParticipant
		const oneOfParticipantsDisqualified = pair.disqualified?.blackParticipant || pair.disqualified?.whiteParticipant
		const bothParticipantsAccepted = pair.acceptedForFight?.blackParticipant && pair.acceptedForFight?.whiteParticipant
		const oneOfParticipantsNotAccepted =
			!pair.acceptedForFight?.blackParticipant || !pair.acceptedForFight?.whiteParticipant
		const showCallupButton =
			isJudgeCompetitionPage && !pair.calledForPreparation && currentFightingGroupIndex && !pair.passed
		const showWinnerButton =
			(isJudgeCompetitionPage && oneOfParticipantsDisqualified && !pair.winner) ||
			(isJudgeCompetitionPage && bothParticipantsAccepted && !pair.winner)
		const finished = pair.winner
		const inProgress =
			pair.acceptedForFight?.blackParticipant && pair.acceptedForFight?.whiteParticipant && !pair.winner
		const waitingCompetitonPage =
			oneOfParticipantsNotAccepted &&
			!pair.winner &&
			!pair.calledForPreparation &&
			!isJudgeCompetitionPage &&
			!bothParticipantsDisqualified
		const waitingJudgeCompetitonPage =
			isJudgeCompetitionPage && !pair.calledForPreparation && !currentFightingGroupIndex

		return {
			cells: [
				{
					node: <span>{firstPairOrder + i}</span>,
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
							<ChooseWinner
								pair={pair}
								groupId={groupId as string}
								onChooseWinner={onChooseWinner}
								isJudgeCompetitionPage={isJudgeCompetitionPage}
							/>
							{showCallupButton && (
								<CallUpButton
									onCallPairPreparation={handleCallPairPreparation}
									breakTime={Boolean(breakTime?.minutes)}
								/>
							)}
							{onDefineWinner && showWinnerButton && (
								<Button
									onClick={() => onDefineWinner(pair._id as string)}
									disabled={lastCompletedPairIndex + 1 !== i || callPairPreparationPending}
									loading={defineWinnerPending}
								>
									Winner
								</Button>
							)}
						</div>
					),
					classes: 'pl-0'
				}
			]
		}
	})
}
