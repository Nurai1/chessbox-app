import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { CompetitionGroupSchema } from 'src/types'
import { ReactComponent as ArrowRightIcon } from 'src/assets/arrow-right.svg'

type CompetitionResultListPropsType = {
	competitionData: CompetitionGroupSchema[]
	onClick: (resulData: CompetitionGroupSchema) => void
	classes?: string
}

export const CompetitionResultList: FC<CompetitionResultListPropsType> = ({ competitionData, classes, onClick }) => {
	return (
		<div className={twMerge('grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4', classes)}>
			{competitionData.map(group => (
				<button
					key={group._id}
					onClick={() => onClick(group)}
					type='button'
					className='flex items-center justify-between gap-4 rounded-2xl border border-pale-grey p-5 transition hover:opacity-70 xl:rounded-3xl xl:p-10'
				>
					<div className='text-left font-semibold xl:text-2xl'>
						<p>
							{group.ageCategory?.from} - {group.ageCategory?.to} age,
						</p>
						<p>
							{group.weightCategory?.from} - {group.weightCategory?.to} kg
						</p>
					</div>
					<ArrowRightIcon className='mr-5 h-6 w-6 lg:mr-2 xl:h-8 xl:w-8' />
				</button>
			))}
		</div>
	)
}
