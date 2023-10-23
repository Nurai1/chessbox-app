import { FC } from 'react'
import { ReactComponent as Place } from 'src/assets/place.svg'

type CompetitonIsOverPropsType = {
	place?: number
}

export const CompetitonIsOver: FC<CompetitonIsOverPropsType> = ({ place }) => {
	return (
		<div className='flex items-center justify-center gap-3 p-3 lg:relative lg:h-fit lg:rounded-xl lg:border lg:p-4 xl:min-h-[14rem] xl:items-baseline xl:p-9'>
			<div>
				<p className='font-bold xl:text-heading-3'>This competition is&nbsp;over</p>
				{place && (
					<div className='mt-2 flex lg:flex-col-reverse xl:mt-3'>
						<p className='text-sm text-grey xl:-mt-2.5'>Your place&nbsp;</p>
						<p className='text-sm text-grey lg:text-2xl lg:font-bold lg:text-black xl:text-heading-1'>{place}</p>
					</div>
				)}
			</div>
			<Place className='h-7 w-7 lg:absolute lg:right-6 lg:bottom-6 lg:h-10 lg:w-10 xl:right-10 xl:bottom-10 xl:h-16 xl:w-16' />
		</div>
	)
}
