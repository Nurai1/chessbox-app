import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { CompetitionRequirementsSchema } from 'src/types'

type CompetitionRequirementsBorderedPropsType = {
	competitionRequirements: CompetitionRequirementsSchema
	classes?: string
}

export const CompetitionRequirementsBordered: FC<CompetitionRequirementsBorderedPropsType> = ({ competitionRequirements, classes }) => {
	return (
		<div className={twMerge('max-w-[16rem] rounded-3xl border border-pale-grey py-5 px-6', classes)}>
			<h3 className='mb-2.5 text-2xl font-semibold'>Competition requirements:</h3>
			<div className='flex justify-between'>
				<div className='grow border-r border-pale-grey pr-4'>
					<p className='text-grey'>Age</p>
					<p className='font-bold'>
						{competitionRequirements?.ageCategory?.from} -{competitionRequirements?.ageCategory?.to}
					</p>
				</div>
				<div className='grow pl-4'>
					<p className='text-grey'>Weight</p>
					<p className='font-bold'>
						{competitionRequirements?.weightCategory?.from} -{competitionRequirements?.weightCategory?.to}{' '}
						<span className='text-grey'>kg</span>
					</p>
				</div>
			</div>
		</div>
	)
}
