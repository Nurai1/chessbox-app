import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type CompetitionInfoPropsType = {
	title: string | ReactNode
	img: ReactNode
	place?: number
	isCompetitionPage?: boolean
	classes?: string
}

export const CompetitionInfo: FC<CompetitionInfoPropsType> = ({ title, img, place, isCompetitionPage, classes }) => {
	return (
		<div
			className={twMerge(`${
				isCompetitionPage
					? 'lg:h-fit lg:min-h-[9rem] lg:items-baseline lg:p-4 xl:min-h-[14rem] xl:items-baseline xl:justify-start xl:p-9'
					: 'lg:min-h-[9.375rem] lg:p-6 xl:h-fit'
			} flex items-center justify-center gap-3 p-3 lg:border lg:rounded-3xl lg:relative lg:items-baseline lg:justify-start`, classes)}
		>
			<div>
				<h3 className={`${isCompetitionPage? 'xl:text-heading-3': 'lg:text-heading-4'} font-bold`}>{title}</h3>
				{place && (
					<div className='mt-2 flex lg:flex-col-reverse xl:mt-3'>
						<p className='text-sm text-grey xl:-mt-2.5'>Your place&nbsp;</p>
						<p className='text-sm text-grey lg:text-2xl lg:font-bold lg:text-black xl:text-heading-1'>{place}</p>
					</div>
				)}
			</div>
			{img}
		</div>
	)
}
