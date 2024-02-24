import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { ReactComponent as CheckMark } from 'src/assets/check-mark.svg'

type CheckboxPropsType =
	| {
			name: string
			onChange: (value?: boolean, name?: string) => void
			type: 'checkbox'
			title?: string
			checked?: boolean
			value?: string
			disabled?: boolean
			classes?: string
	  }
	| {
			name: string
			onChange: (value?: string, name?: string) => void
			type: 'radio'
			title?: string
			checked?: boolean
			value?: string
			disabled?: boolean
			classes?: string
	  }

export const CheckboxAndRadioButton: FC<CheckboxPropsType> = ({
	title,
	name,
	onChange,
	type,
	value,
	checked = false,
	disabled,
	classes
}) => {
	const checkedStyle = twMerge(
		'peer-checked:before:absolute peer-checked:before:w-6 peer-checked:before:h-6 peer-checked:before:border-black peer-checked:before:left-0 peer-checked:before:z-10',
		type === 'checkbox' && 'peer-checked:before:bg-black peer-checked:before:rounded',
		type === 'radio' &&
			'peer-checked:before:border peer-checked:before:rounded-full peer-checked:before:bg-white peer-checked:after:absolute peer-checked:after:w-[0.875rem] peer-checked:after:h-[0.875rem] peer-checked:after:left-[0.3125rem] peer-checked:after:top-[0.1875rem] peer-checked:after:bg-black peer-checked:after:rounded-full peer-checked:after:z-10'
	)

	return (
		<div className={twMerge('relative inline-block', disabled && 'pointer-events-none opacity-50', classes)}>
			<input
				type={type}
				tabIndex={disabled ? -1 : 0}
				id={type === 'checkbox' ? name : value}
				name={name}
				value={value}
				checked={checked}
				onChange={event => {
					if (type === 'checkbox') {
						onChange(event?.target?.checked ?? '', event?.target?.name ?? '')
					} else {
						onChange(event?.target?.value ?? '', event?.target?.name ?? '')
					}
				}}
				className={twMerge(
					'peer absolute h-6 w-6 border-pale-grey focus:outline-none focus:ring-transparent focus-visible:ring-black',
					type === 'checkbox' && 'rounded border-2'
				)}
			/>
			<label
				htmlFor={type === 'checkbox' ? name : value}
				className={`relative select-none pl-8 hover:cursor-pointer ${checkedStyle}`}
			>
				{title}
			</label>
			{checked && type === 'checkbox' && (
				<CheckMark className='pointer-events-none absolute left-[0.3125rem] top-1.5 z-10' />
			)}
		</div>
	)
}
