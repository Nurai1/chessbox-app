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
			primary: 'bg-blue-500 text-white hover:bg-blue-600',
			outlined:
				'text-blue-500 border-2 border-blue-600 py-[10px] px-[14px] hover:text-white hover:bg-blue-500 hover:border-blue-500',
			ghost: 'text-blue-500 hover:bg-blue-100'
		},
		loader: {
			primary: 'border-gray-300 border-t-blue-500',
			outlined: 'border-blue-500 border-t-gray-300',
			ghost: 'border-blue-500 border-t-gray-300'
		},
		disabled: {
			primary: 'bg-blue-200 text-gray-50 hover:bg-blue-200',
			outlined: 'border-blue-200 text-blue-200 hover:bg-transparent hover:text-blue-200 hover:border-blue-200',
			ghost: 'text-gray-300 hover:text-gray-300 hover:bg-transparent'
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
				'inline-flex-center h-[46px] gap-2 rounded-md px-4 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
				classes
			)}
		>
			{loading ? (
				<div
					className={twMerge(
						button({ loader: type }),
						'm-auto box-border h-5 w-5 animate-spin rounded-full border-[3px]'
					)}
				/>
			) : (
				children
			)}
		</button>
	)
}
