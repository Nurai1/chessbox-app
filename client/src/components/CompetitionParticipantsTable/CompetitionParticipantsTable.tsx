import { FC, Fragment, useRef } from 'react'
import { TableBody, Loader } from 'src/ui'
import { CompetitionSchema, ParticipantSchema, UserSchema } from 'src/types'
import { getGroupPairsLen } from 'src/helpers/getGroupPairsLen'
import { tableSchemaPairs, PairType } from 'src/helpers/tableSchemas/tableSchemaPairs'
import { ChooseWinnerType } from 'src/routes/JudgeCompetitionPage'
import { getFormattedDate, getAge } from 'src/helpers/datetime'
import { getTimeTuplePlusMinutes } from 'src/helpers/getTimeTuplePlusMinutes'

type CompetitionParticipantsTablePropsType = {
    competitionData: CompetitionSchema
    participants: ParticipantSchema[]
    judges: UserSchema[]
    authorizedUser: UserSchema
	isJudgeCompetitionPage?: boolean
	onCallPairPreparation?: (groupId: string, pairId: string) => void
	isBreakTime?: boolean
	onCallUpTimer?: (pairId: string) => void
	maxPairs?: number
	currentPairs?: string[]
	onChooseWinner?: (data: ChooseWinnerType) => void
}

export const CompetitionParticipantsTable: FC<CompetitionParticipantsTablePropsType> = ({
	competitionData, 
	participants, 
	judges, 
	authorizedUser,
	...rest
}) => {
    const currentUserPairRef = useRef<{ pair?: PairType; withPair?: boolean; startTime: string }>()
    const startPointTimeTuple =
    competitionData?.startDate && Number(new Date(competitionData?.startDate)) - Date.now() > 0
        ? getFormattedDate(competitionData.startDate, 'HH:mm').split(':')
        : getFormattedDate(new Date().toISOString(), 'HH:mm').split(':')
    const groupsAllPairsLen = competitionData?.groups?.map(group =>
		getGroupPairsLen({
			currentPairsLen: group.currentRoundPairs?.length ?? 0,
			nextRoundParticipantsLen: group.nextRoundParticipants?.length ?? 0
		})
	)

	return (
		<div className='xl:px[50px] flex grow flex-col lg:rounded-3xl lg:border lg:border-[#DADADA] lg:px-[40px] lg:pt-[33px] xl:pt-[63px]'>
			{competitionData.groups?.map(
				({ _id, gender, ageCategory, weightCategory, currentRoundPairs, nextRoundParticipants }, groupIndex) => {
					const currentRoundPairsLen = currentRoundPairs?.length ?? 0
					const competitionJudgesLen = competitionData?.judges?.length ?? 1

					let pairsBeforeLen = 0
					for (let i = 0; i < groupIndex; i += 1) {
						pairsBeforeLen += groupsAllPairsLen?.[i] ?? 0
					}

					pairsBeforeLen =
						pairsBeforeLen % competitionJudgesLen === 0
							? pairsBeforeLen
							: pairsBeforeLen + (pairsBeforeLen % competitionJudgesLen)

					const nextRoundParticipantsStartTime = getTimeTuplePlusMinutes(
						startPointTimeTuple,
						((pairsBeforeLen + currentRoundPairsLen) * 10) / competitionJudgesLen +
							(competitionData?.breakTime?.minutes ?? 0)
					).join(':')

					return (
						<Fragment key={_id}>
							<h3 className='mb-[17px] font-bold md:mb-[32px] xl:text-2xl [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-[24px]'>
								{getTimeTuplePlusMinutes(
									startPointTimeTuple,
									(pairsBeforeLen * 10) / competitionJudgesLen + (competitionData?.breakTime?.minutes ?? 0)
								).join(':')}
								<span className='ml-3 inline-block capitalize'>{gender}</span> {ageCategory?.from}-{' '}
								{ageCategory?.to} age, {weightCategory?.from}-{weightCategory?.to}kg
							</h3>
							{currentRoundPairs ? (
								<TableBody
									rows={tableSchemaPairs({
										tableData: currentRoundPairs,
										participants,
										judges,
										startTimeTuple: getTimeTuplePlusMinutes(
											startPointTimeTuple,
											(pairsBeforeLen * 10) / competitionJudgesLen + (competitionData?.breakTime?.minutes ?? 0)
										),
										currentUser: { currentUserPairRef, authorizedUserId: authorizedUser?._id },
										breakTime: competitionData?.breakTime,
										groupIndex,
										groupId: _id,
										...rest
									})}
								/>
							) : (
								<Loader />
							)}
							{!!nextRoundParticipants?.length && (
								<h3 className='mb-[17px] font-bold md:mb-[32px] xl:text-2xl [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-[24px]'>
									{getTimeTuplePlusMinutes(
										startPointTimeTuple,
										((pairsBeforeLen + currentRoundPairsLen) * 10) / competitionJudgesLen +
											(competitionData?.breakTime?.minutes ?? 0)
									).join(':')}
									<span className='ml-3 inline-block capitalize'>{gender}</span> {ageCategory?.from}-{ageCategory?.to}{' '}
									age, {weightCategory?.from}-{weightCategory?.to}kg
								</h3>
							)}
							{nextRoundParticipants?.map((participantId, participantIdx) => {
								const nextRoundParticipant = participants
									? participants.find(({ _id: pId }) => pId === participantId)
									: null

								if (participantId === authorizedUser?._id) {
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
										<div className='h-full w-[50px] font-bold'>{participantIdx}</div>
										<div className='flex h-full grow flex-col'>
											<div className='mb-[7px] text-sm text-black xl:text-base'>{nextRoundParticipant?.fullName}</div>
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
						</Fragment>
					)
				}
			)}
		</div>
	)
}
