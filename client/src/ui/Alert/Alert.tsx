import { ReactComponent as CheckMarkIcon } from 'src/assets/check-mark-rounded.svg'
import { ReactComponent as ExclamationTriangleIcon } from 'src/assets/exclamation-triangle-fill.svg'
import { ReactComponent as InfoIcon } from 'src/assets/info-rounded.svg'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

export type AlertPropTypes = {
	type?: 'error' | 'success' | 'info'
	title?: string
	subtitle?: string
	classes?: string
}

export const TYPE_TO_ICON_MAP = {
	error: <ExclamationTriangleIcon />,
	success: <CheckMarkIcon className='h-4 w-6 fill-teal-500' />,
	info: <InfoIcon />
}

const alert = tv({
	variants: {
		bg: {
			success: 'bg-teal-50',
			error: 'bg-red-50',
			info: 'bg-sky-200'
		},
		title: {
			success: 'text-teal-800',
			error: 'text-red-800',
			info: 'text-sky-800'
		},
		subtitle: {
			success: 'text-teal-700',
			error: 'text-red-700',
			info: 'text-sky-700'
		}
	}
})

export const Alert: FC<AlertPropTypes> = ({ subtitle, title, type = 'error', classes }) => {
	const Icon = TYPE_TO_ICON_MAP[type]
	return (
		<div className={twMerge('relative mt-auto flex w-full gap-5 rounded-md p-4', alert({ bg: type }), classes)}>
			<div className='mt-[3px]'>{Icon}</div>
			<div className='text-left'>
				<div className={twMerge('text-lg font-semibold leading-none', alert({ title: type }))}>{title}</div>
				{subtitle && (
					<span
						className={twMerge(
							'toast__message_scrollbar inline-block max-h-[15vh] overflow-y-auto',
							alert({ subtitle: type })
						)}
					>
						{subtitle}
					</span>
				)}
			</div>
		</div>
	)
}
