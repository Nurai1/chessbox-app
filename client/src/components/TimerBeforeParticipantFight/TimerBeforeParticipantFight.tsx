import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { isPast } from 'src/helpers/datetime'
import { PairType } from 'src/helpers/tableSchemas/tableSchemaPairs'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { fetchedOrExistingCompetitionSelector } from 'src/store/selectors/competitions'
import { acceptForFight } from 'src/store/slices/competitionSlice'
import { Button, Timer } from 'src/ui'

export const TimerBeforeParticipantFight: FC<{ currentPair?: PairType }> = ({ currentPair }) => {
	const { competitionId } = useParams()
	const dispatch = useAppDispatch()

	const competitionData = useAppSelector(fetchedOrExistingCompetitionSelector(competitionId))
	const authorizedUser = useAppSelector(state => state.user.authorizedUser)
	const { acceptForFightPending, acceptForFightSuccess } = useAppSelector(state => state.competition)
	const isCompetitionOnGoing = competitionData && isPast(competitionData.startDate)

	const participantColor =
		currentPair?.blackParticipant === authorizedUser?._id ? 'blackParticipant' : 'whiteParticipant'

	const exeptedFight =
		acceptForFightSuccess || (currentPair?.acceptedForFight && currentPair?.acceptedForFight[participantColor])
	const disqualified = currentPair?.disqualified && currentPair.disqualified[participantColor] && !acceptForFightSuccess
	const calledForFight = !exeptedFight && !disqualified && !acceptForFightSuccess

	const showComponent = isCompetitionOnGoing && currentPair?.calledForPreparation
	if (!showComponent) {
		return null
	}

	return (
		<div>
			<div className='relative mb-[24px] flex w-full justify-between rounded-[12px] border p-[10px] lg:mb-0 lg:block lg:h-fit lg:w-auto xl:p-[25px]'>
				<div className='xl:mb-6'>
					{calledForFight && (
						<>
							<h3 className='text-title text-error-red xl:text-heading-3'>Approximate time start:</h3>
							<span className='text-caption text-error-red lg:text-base'>To confirm participation press READY!</span>
						</>
					)}
					{disqualified && (
						<>
							<h3 className='text-title xl:text-heading-3'>You are disqualified</h3>
							<span className='text-caption lg:text-base'>
								You are disqualified from competition because you missed start
							</span>
						</>
					)}
					{exeptedFight && <h3 className='text-title xl:text-heading-3'>You are in!</h3>}
				</div>
				<div className='flex items-baseline lg:flex-col lg:gap-[20px]'>
					{!exeptedFight && competitionData && (
						<Timer
							showDays={false}
							secondsLeft={disqualified ? 0 : 110000}
							containerClasses='xl:h-[107px] xl:w-[107px] text-error-red'
							countNumbersClasses={`xl:text-heading-3 xl:leading-[3rem] font-bold ${exeptedFight ? 'text-black' : ''}`}
							countLabelsClasses={exeptedFight ? 'text-grey' : ''}
						/>
					)}
				</div>
			</div>
			<div className='fixed inset-x-0 bottom-0 bg-white p-6 shadow-lg lg:static lg:p-0 lg:shadow-none'>
				{calledForFight && (
					<Button
						onClick={() => {
							if (competitionId && authorizedUser?.currentGroupId && currentPair?._id && authorizedUser?._id)
								dispatch(
									acceptForFight({
										competitionId,
										groupId: authorizedUser.currentGroupId,
										pairId: currentPair._id,
										userId: authorizedUser._id
									})
								)
						}}
						classes='w-full lg:mt-6'
						loading={acceptForFightPending}
					>
						READY!
					</Button>
				)}
			</div>
			{exeptedFight && (
				<div className='flex-center'>
					<a
						href={competitionData.zoomLink}
						target='_blank'
						rel='noreferrer'
						className='mx-auto font-medium underline transition hover:opacity-70 xl:mt-6 xl:text-heading-4'
					>
						Link to Zoom
					</a>
				</div>
			)}
		</div>
	)
}
