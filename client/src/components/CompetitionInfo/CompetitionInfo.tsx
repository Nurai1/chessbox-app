import { FC, ReactNode } from 'react'

type CompetitionInfoPropsType = {
	title: string | ReactNode
	img: ReactNode
	place?: number
}

export const CompetitionInfo: FC<CompetitionInfoPropsType> = ({ title, img,  place }) => {
	return (
		<div className='flex items-center justify-center gap-3 p-3 lg:relative lg:items-baseline lg:h-fit lg:rounded-xl lg:border lg:p-4 lg:min-h-[9rem] xl:min-h-[14rem] xl:items-baseline xl:p-9'>
			<div>
				<p className='font-bold xl:text-heading-3'>{title}</p>
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
