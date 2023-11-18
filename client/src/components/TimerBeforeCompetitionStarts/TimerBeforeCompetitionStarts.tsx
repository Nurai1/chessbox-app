import { FC } from 'react'
import { CompetitionSchema } from 'src/types'
import { Timer } from 'src/ui'
import { isPast } from '../../helpers/datetime'

type TimerBeforeCompetitionStartsPropsType = {
	competitionData: CompetitionSchema
	onTimeOver: () => void
}

export const TimerBeforeCompetitionStarts: FC<TimerBeforeCompetitionStartsPropsType> = ({
	competitionData,
	onTimeOver
}) => {
	return isPast(competitionData.startDate) ? null : (
		<div>
			<div
				className='mb-5 flex items-center justify-between rounded-2xl border-2 p-3
                    md:py-4 md:px-9
                    lg:h-fit lg:flex-col lg:justify-start lg:gap-6 lg:p-4
                    xl:items-baseline xl:p-7'
			>
				<div>
					<h3 className='mr-1 mb-2 text-sm xl:text-heading-3 xl:text-grey'>
						Approximate time start before competition:
					</h3>
					{competitionData && (
						<Timer
							time={competitionData.startDate}
							classes='gap-1.5 lg:gap-3'
							containerClasses='lg:w-14 lg:h-14 xl:h-[6.5rem] xl:min-w-[6.5rem] xl:p-4'
							countNumbersClasses='xl:text-[2rem]'
							handleTimeOver={onTimeOver}
						/>
					)}
				</div>
			</div>
		</div>
	)
}
