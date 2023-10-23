import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { isPast } from 'src/helpers/datetime'
import { PairType } from 'src/helpers/tableSchemas/TableSchemaPairs'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { existingOrFetchedCompetitionSelector } from 'src/store/selectors/competitions'
import { acceptForFight } from 'src/store/slices/competitionSlice'
import { Button, Timer } from 'src/ui'

export const TimerBeforeParticipantFight: FC<{ currentPair?: PairType }> = ({ currentPair }) => {
	const { competitionId } = useParams()
	const dispatch = useAppDispatch()

	const competitionData = useAppSelector(existingOrFetchedCompetitionSelector(competitionId))
	const authorizedUser = useAppSelector(state => state.user.authorizedUser)
	const isCompetitionOnGoing = competitionData && isPast(competitionData.startDate)

	const participantColor =
		currentPair?.blackParticipant === authorizedUser?._id ? 'blackParticipant' : 'whiteParticipant'

	const showComponent =
		isCompetitionOnGoing && currentPair?.calledForPreparation && !currentPair.acceptedForFight?.[participantColor]
	if (!showComponent) {
		return null
	}

	return (
		<div>
			<div className='relative mb-[24px] flex w-full justify-between rounded-[12px] border p-[10px] lg:mb-0 lg:block lg:h-fit lg:w-auto xl:p-[25px]'>
				<div className='xl:mb-6'>
					<h3 className='text-title text-error-red xl:text-heading-3'>Approximate time start:</h3>
					<span className='text-caption text-error-red lg:text-base'>To confirm participation press READY!</span>
				</div>

				<div className='flex items-baseline lg:flex-col lg:gap-[20px]'>
					{competitionData && (
						<Timer
							showDays={false}
							secondsLeft={110000}
							containerClasses='xl:h-[107px] xl:w-[107px] text-error-red'
							countNumbersClasses='xl:text-[32px] xl:leading-[48px] font-bold'
						/>
					)}
				</div>
			</div>
			<div className='fixed inset-x-0 bottom-0 bg-white p-6 shadow-lg lg:static lg:p-0 lg:shadow-none'>
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
				>
					READY!
				</Button>
			</div>
		</div>
	)
}
