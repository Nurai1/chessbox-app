import { CompetitionRequirementsSchema } from 'src/types'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

type CompetitionRequirementsPropsType = {
	competitionRequirements: CompetitionRequirementsSchema
	classes?: string
}

export const CompetitionRequirements: FC<CompetitionRequirementsPropsType> = ({ competitionRequirements, classes }) => {
	return (
		<div className={twMerge('flex items-center', classes)}>
			<p className='max-w-[9.375rem] pr-2 md:pr-4 text-grey xl:font-bold'>Competition requirements:</p>
			<div className='min-w-[6.25rem] border-x px-2 md:px-4'>
				<p className='mb-2 text-sm xl:text-base'>Age:</p>
				<p className='whitespace-nowrap font-bold'>
					{competitionRequirements?.ageCategory?.from} - {competitionRequirements?.ageCategory?.to}{' '}
				</p>
			</div>
			<div className='min-w-[6.25rem] pl-2 md:pl-4'>
				<p className='mb-2 text-sm xl:text-base'>Weight:</p>
				<p className='whitespace-nowrap font-bold'>
					{competitionRequirements?.weightCategory?.from} - {competitionRequirements?.weightCategory?.to}
					<span className='text-grey'> kg</span>
				</p>
			</div>
		</div>
	)
}
