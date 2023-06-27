import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

type LoaderProps = {
	classes?: string
}

export const Loader: FC<LoaderProps> = ({ classes }) => {
	return (
		<div className={twMerge('flex h-full grow items-center justify-center', classes)}>
			<span className='block h-[32px] w-[32px] animate-spin rounded-full border-[4px] border-black border-b-transparent lg:h-[48px] lg:w-[48px] lg:border-[5px]' />
		</div>
	)
}
