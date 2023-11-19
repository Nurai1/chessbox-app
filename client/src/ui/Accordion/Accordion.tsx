import { FC, useState, ReactNode } from 'react'
import { ReactComponent as ArrowDownIcon } from 'src/assets/arrow-down-big.svg'
import { twMerge } from 'tailwind-merge'

type AccordionPropsType = {
	children: ReactNode
	title?: ReactNode
	classes?: string
	isOpenDefault?: boolean
	additionalIcon?: ReactNode
}

export const Accordion: FC<AccordionPropsType> = ({
	children,
	title,
	classes,
	isOpenDefault = false,
	additionalIcon
}) => {
	const [isOpen, setIsOpen] = useState(isOpenDefault)
	return (
		<div
			className={twMerge(
				'py-4 xl:py-[1.62rem] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-300',
				classes
			)}
		>
			<div className='flex items-center'>
				<button
					className='flex grow items-center gap-2 transition hover:opacity-70'
					onClick={() => setIsOpen(!isOpen)}
					type='button'
				>
					{title}
					<ArrowDownIcon className={`${isOpen && 'rotate-180'} ml-auto transition`} />
				</button>
				{additionalIcon}
			</div>
			<div
				className='grid overflow-hidden transition-all'
				style={{
					gridTemplateRows: `${isOpen ? '1fr' : '0fr'}`
				}}
			>
				<div className='min-h-0 pt-4 xl:pt-[1.62rem]'>{children}</div>
			</div>
		</div>
	)
}
