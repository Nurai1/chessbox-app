import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { Timer } from 'src/ui'
import { CompetitionSchema } from 'src/types'

type CompetitionCardTimerPropsType = {
	competitionData: CompetitionSchema
    title: ReactNode
    classes?: string 
}

export const CompetitionCardTimer: FC<CompetitionCardTimerPropsType> = ({ competitionData, title, classes }) => {
	return (
		<div className={twMerge('flex lg:flex-col lg:p-6 lg:border lg:rounded-3xl', classes)}>
			<h3 className='mr-4 max-w-[16rem] font-bold lg:mb-6 lg:text-2xl lg:max-w-none lg:mr-0'>{title}</h3>
			{competitionData && (
				<Timer
					time={competitionData.startDate}
					classes='gap-1.5 lg:gap-3'
					containerClasses='lg:w-full lg:h-[4.7rem]'
					countNumbersClasses='lg:text-2xl'
				/>
			)}
		</div>
	)
}
