import { FC, ReactElement, useState, useRef, useEffect } from 'react'
import { ReactComponent as DragIcon } from 'src/assets/drag-icon.svg'
import { ReactComponent as ArrowDownIcon } from 'src/assets/arrow-down-big.svg'
import { twMerge } from 'tailwind-merge'

type AccordionPropsType = {
	children: ReactElement
	title: ReactElement
	isDragable?: boolean
	classes?: string
	isActiveDefault?: boolean
}

export const Accordion: FC<AccordionPropsType> = ({
	children,
	title,
	isDragable,
	classes,
	isActiveDefault = false
}) => {
	const [active, setActive] = useState(isActiveDefault)
	const [contentHeight, setContentHeight] = useState<number>()
	const [overflow, setOverflow] = useState('hidden')
	const contentRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (contentRef.current && active) {
			setContentHeight(contentRef.current.clientHeight)
			setTimeout(() => setOverflow('visible'), 200)
		} else {
			setContentHeight(0)
			setOverflow('hidden')
		}
	}, [active])

	return (
		<div
			className={twMerge(
				'py-4 xl:py-[1.62rem] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-300',
				classes
			)}
		>
			<div className='flex items-center'>
				{isDragable && <DragIcon className='mr-5 cursor-pointer' />}
				<button
					className='flex grow items-center justify-between gap-2 transition hover:opacity-70'
					onClick={() => setActive(!active)}
					type='button'
				>
					{title}
					<ArrowDownIcon className={twMerge('transition', active && 'rotate-180')} />
				</button>
			</div>
			<div
				className={twMerge('transition-500 overflow-hidden transition-[max-height]')}
				style={{
					maxHeight: `${contentHeight}px`,
					transitionDuration: '0.2s',
					overflow: `${overflow}`
				}}
			>
				<div ref={contentRef} className='pt-4 xl:pt-[1.62rem]'>
					{children}
				</div>
			</div>
		</div>
	)
}
