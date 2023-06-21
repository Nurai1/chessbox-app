import { FC, ReactNode, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

type ButtonPropsType = {
	onClick: React.MouseEventHandler<HTMLButtonElement>
	type?: 'primary' | 'outlined' | 'ghost'
	children: ReactNode
	loading?: boolean
	disabled?: boolean
	classes?: string
}

const button = tv({
	variants: {
		shape: {
			primary: 'bg-black text-white border-2 border-black hover:bg-gray-700',
			outlined: 'text-black border-2 border-black hover:text-white hover:bg-black ',
			ghost: 'text-black border-2 border-transparent hover:bg-gray-200'
		},
		loader: {
			primary: 'border-gray-300 border-t-black',
			outlined: 'border-gray-300 border-t-black',
			ghost: 'border-gray-300 border-t-black'
		},
		disabled: {
			primary: 'bg-black text-gray-50 bg-gray-300 border-gray-300 pointer-events-none',
			outlined: 'border-gray-300 text-gray-300 pointer-events-none',
			ghost: 'text-gray-300 pointer-events-none'
		}
	}
})

export const Button: FC<ButtonPropsType> = ({ children, type = 'primary', onClick, loading, classes, disabled }) => {
	const ref = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (ref.current) {
			// strange calculated actual browser width equals width + 0.4 but clientWidth doesn't contain it
			ref.current.style.width = `${ref.current.clientWidth + 0.4}px`
		}
	}, [])

	return (
		<button
			disabled={disabled}
			ref={ref}
			type='button'
			onClick={loading ? undefined : onClick}
			className={twMerge(
				button({ shape: type }),
				disabled && button({ disabled: type }),
				'inline-flex-center h-[46px] gap-2 rounded-md px-4 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
				classes
			)}
		>
			{loading ? (
				<div
					className={twMerge(
						button({ loader: type }),
						'm-auto box-border h-5 w-5 animate-spin rounded-full border-[3px]'
					)}
					style={{ minWidth: '20px' }}
				/>
			) : (
				children
			)}
		</button>
	)
}
