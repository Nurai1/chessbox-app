import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { ReactComponent as CheckMark } from 'src/assets/check-mark.svg'

type CheckboxPropsType = {
	name: string
	onChange: (value?: boolean, name?: string) => void
	title?: string
	checked?: boolean
	disabled?: boolean
	classes?: string
}

export const Checkbox: FC<CheckboxPropsType> = ({ title, name, onChange, checked = false, disabled, classes }) => {
	const checkedStyle =
		'peer-checked:before:absolute peer-checked:before:w-[24px] peer-checked:before:h-[24px] peer-checked:before:border-2 peer-checked:before:rounded peer-checked:before:border-black peer-checked:before:left-[0] peer-checked:before:bg-black peer-checked:before:z-10 '
	return (
		<div className={twMerge('relative inline-block', disabled && 'pointer-events-none opacity-50', classes)}>
			<input
				type='checkbox'
				tabIndex={disabled ? -1 : 0}
				id={name}
				name={name}
				checked={checked}
				onChange={event => {
					onChange(event?.target?.checked ?? '', event?.target?.name ?? '')
				}}
				className='peer absolute h-[24px] w-[24px] rounded border-2 border-[#DADADA] focus:outline-none focus:ring-transparent focus-visible:ring-black'
			/>
			<label htmlFor={name} className={`relative select-none pl-[32px] hover:cursor-pointer ${checkedStyle}`}>
				{title}
			</label>
			{checked && <CheckMark className='pointer-events-none absolute left-[5px] top-[6px] z-10 h-[11px] w-[14px]' />}
		</div>
	)
}
