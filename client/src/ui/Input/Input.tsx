import { ReactComponent as BigSearchLoopIcon } from 'src/assets/big-search-loop.svg'
import { ReactComponent as SearchLoopIcon } from 'src/assets/search-loop.svg'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { Label } from 'src/ui'

export type InputPropsType = {
	label?: string
	onChange: (value: string | undefined) => void
	onFocus?: () => void
	value?: string
	placeholder?: string
	isTextarea?: boolean
	isRequired?: boolean
	isSearch?: boolean
	loopPosition?: 'left' | 'right'
	validationErrorText?: string
	disabled?: boolean
	isControlledValue?: boolean
	classes?: string
}

export const Input: FC<InputPropsType> = ({
	value,
	isTextarea,
	label,
	onChange,
	placeholder,
	isRequired,
	isSearch,
	loopPosition = 'left',
	validationErrorText,
	onFocus,
	disabled,
	isControlledValue = true,
	classes
}) => {
	const generalClasses = 'w-full rounded-md border-gray-200 text-input font-medium z-10'

	return (
		<div className='flex w-full flex-wrap'>
			<Label label={label} showOptional={!isRequired && !isSearch} />
			{isTextarea ? (
				<div className='relative flex w-full'>
					<textarea
						disabled={disabled}
						value={isControlledValue ? value ?? '' : undefined}
						required={isRequired}
						placeholder={placeholder}
						onChange={event => onChange(event?.target?.value ?? '')}
						onFocus={onFocus}
						className={twMerge(
							generalClasses,
							'h-28 resize-none px-4 py-[0.875rem] placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400',
							validationErrorText && 'border-red-400 ring-4 ring-red-200',
							classes
						)}
					/>
				</div>
			) : (
				<div className='relative flex w-full items-center'>
					{isSearch && loopPosition === 'left' && <SearchLoopIcon className='absolute left-4 z-20' />}
					<input
						disabled={disabled}
						value={isControlledValue ? value ?? '' : undefined}
						required={isRequired}
						placeholder={placeholder}
						onChange={event => {
							onChange(event?.target?.value ?? '')
						}}
						onFocus={onFocus}
						className={twMerge(
							generalClasses,
							'h-16 px-5 placeholder:text-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/25 disabled:bg-gray-50 disabled:text-gray-400',
							validationErrorText && 'border-red-400 ring-4 ring-red-200',
							isSearch && loopPosition === 'right' && 'h-12 pr-12',
							isSearch && loopPosition === 'left' && 'h-12 pl-12',
							classes
						)}
						type='text'
					/>
					{isSearch && loopPosition === 'right' && <BigSearchLoopIcon className='absolute right-5 z-20' />}
				</div>
			)}
			{validationErrorText && (
				<span className='mt-[10px] inline-block text-xs leading-none text-red-400'>{validationErrorText}</span>
			)}
		</div>
	)
}
