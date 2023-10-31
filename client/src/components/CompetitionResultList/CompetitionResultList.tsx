import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { CompetitionSchema } from 'src/types'
import { ReactComponent as ArrowRightIcon } from 'src/assets/arrow-right.svg'

type CompetitionResultListPropsType = {
	competitionData: CompetitionSchema
	classes?: string
}

export const CompetitionResultList: FC<CompetitionResultListPropsType> = ({ competitionData, classes }) => {
	return (
		<div className={twMerge('grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4', classes)}>
			{competitionData.groups?.map(group => (
				<button className='flex items-center justify-between gap-4 rounded-3xl border border-pale-grey p-5 transition hover:opacity-70 lg:p-10'>
					<div className='font-semibold lg:text-2xl'>
						<p>18 -25 age,</p>
						<p>50 - 85 kg</p>
					</div>
					<ArrowRightIcon className='mr-5 lg:mr-2' />
				</button>
			))}
		</div>
	)
}
