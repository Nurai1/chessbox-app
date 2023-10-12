import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

type ButtonPropsType = {
	onClick?: React.MouseEventHandler<HTMLButtonElement>
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
			ghost: 'text-black border-2 border-transparent hover:opacity-70'
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
	return (
		<button
			disabled={disabled}
			type='button'
			onClick={loading ? undefined : onClick}
			className={twMerge(
				button({ shape: type }),
				disabled && button({ disabled: type }),
				loading && 'pointer-events-none',
				'inline-flex-center h-[2.875rem] select-none gap-2 rounded-md px-4 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
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
