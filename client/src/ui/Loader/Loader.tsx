import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

type LoaderProps = {
	classes?: string
	ringClasses?: string
}

export const Loader: FC<LoaderProps> = ({ classes, ringClasses }) => {
	return (
		<div className={twMerge(
			'flex grow items-center justify-center',
			classes)}>
			<span className={twMerge(
				'block h-8 w-8 animate-spin rounded-full border-4 border-black border-b-transparent lg:h-12 lg:w-12 lg:border-[0.3125rem]',
				ringClasses)} />
		</div>
	)
}
