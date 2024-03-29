import { ReactComponent as BigSearchLoopIcon } from 'src/assets/big-search-loop.svg'
import { ReactComponent as SearchLoopIcon } from 'src/assets/search-loop.svg'
import { ReactComponent as Eye } from 'src/assets/eye.svg'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { Label } from 'src/ui'

export type InputPropsType = {
	label?: string
	onChange: (value: string | undefined, name: string | undefined) => void
	onFocus?: () => void
	autoFocus?: boolean
	value?: string
	name?: string
	type?: 'text' | 'number' | 'password'
	placeholder?: string
	isTextarea?: boolean
	isRequired?: boolean
	isSearch?: boolean
	loopPosition?: 'left' | 'right'
	validationErrorText?: string | null
	disabled?: boolean
	isControlledValue?: boolean
	classes?: string
	onShowPassword?: () => void
	showPasswordIcon?: boolean
}

export const Input: FC<InputPropsType> = ({
	value,
	name,
	type = 'text',
	isTextarea,
	label,
	onChange,
	placeholder,
	isRequired,
	isSearch,
	loopPosition = 'left',
	validationErrorText,
	onFocus,
	autoFocus,
	disabled,
	isControlledValue = true,
	classes,
	onShowPassword,
	showPasswordIcon
}) => {
	const generalClasses = 'w-full rounded-lg border-gray-200 text-input font-light z-10'

	return (
		<div className='relative flex w-full flex-wrap'>
			{label && <Label label={label} htmlFor={name} />}
			{isTextarea ? (
				<div className='relative flex w-full'>
					<textarea
						disabled={disabled}
						value={isControlledValue ? value ?? '' : undefined}
						name={name}
						required={isRequired}
						placeholder={placeholder}
						onChange={event => {
							onChange(event?.target?.value ?? '', event?.target?.name ?? '')
						}}
						onFocus={onFocus}
						className={twMerge(
							generalClasses,
							'h-28 resize-none px-4 py-[0.875rem] placeholder:text-[#B3B3B3] disabled:bg-gray-50 disabled:text-gray-400',
							validationErrorText && 'border-red-400 ring-4 ring-red-200',
							classes
						)}
						id={name}
						// eslint-disable-next-line jsx-a11y/no-autofocus
						autoFocus={autoFocus}
					/>
				</div>
			) : (
				<div className='relative flex w-full items-center'>
					{isSearch && loopPosition === 'left' && <SearchLoopIcon className='absolute left-4 z-20' />}
					<input
						disabled={disabled}
						value={isControlledValue ? value ?? '' : undefined}
						name={name}
						required={isRequired}
						placeholder={placeholder}
						onChange={event => {
							onChange(event?.target?.value ?? '', event?.target?.name ?? '')
						}}
						onFocus={onFocus}
						className={twMerge(
							generalClasses,
							'h-[54px] px-5 placeholder:text-[#B3B3B3] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/25 disabled:bg-gray-50 disabled:text-gray-400',
							validationErrorText && 'border-red-400 ring-4 ring-red-200',
							isSearch && loopPosition === 'right' && 'pr-12',
							isSearch && loopPosition === 'left' && 'pl-12',
							classes
						)}
						type={type}
						id={name}
						// eslint-disable-next-line jsx-a11y/no-autofocus
						autoFocus={autoFocus}
					/>
					{isSearch && loopPosition === 'right' && <BigSearchLoopIcon className='absolute right-5 z-20' />}
					{showPasswordIcon && (
						<span
							className={twMerge(
								'absolute right-5 z-20',
								type === 'text' &&
									'before:absolute before:top-[11px] before:block before:h-[1px] before:w-full before:rotate-45 before:bg-[#999999]'
							)}
						>
							<Eye onClick={onShowPassword} className='cursor-pointer transition hover:opacity-70' />
						</span>
					)}
				</div>
			)}
			{validationErrorText && (
				<span className='absolute bottom-[-18px] text-xs leading-none text-red-400'>{validationErrorText}</span>
			)}
		</div>
	)
}
