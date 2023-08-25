import { FC, useState, useRef, useEffect, ReactNode } from 'react'
import { ReactComponent as ArrowDownIcon } from 'src/assets/arrow-down-big.svg'
import { twMerge } from 'tailwind-merge'

type AccordionPropsType = {
	children: ReactNode
	title?: ReactNode
	classes?: string
	isOpenDefault?: boolean
}

export const Accordion: FC<AccordionPropsType> = ({ children, title, classes, isOpenDefault = false }) => {
	const [isOpen, setIsOpen] = useState(isOpenDefault)
	const [contentHeight, setContentHeight] = useState<number>()
	const [overflowStyle, setOverflowStyle] = useState('hidden')
	const [displayStyle, setDisplayStyle] = useState('none')
	const accordionContentRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (accordionContentRef.current && isOpen) {
			setDisplayStyle('block')
			setTimeout(() => setContentHeight(accordionContentRef.current?.clientHeight))
			setTimeout(() => setOverflowStyle('visible'), 200)
		} else {
			setContentHeight(0)
			setOverflowStyle('hidden')
			setTimeout(() => setDisplayStyle('none'), 200)
		}
	}, [isOpen])

	return (
		<div
			className={twMerge(
				'py-4 xl:py-[1.62rem] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-300',
				classes
			)}
		>
			<div className='flex items-center'>
				<button
					className='flex grow items-center justify-between gap-2 transition hover:opacity-70'
					onClick={() => setIsOpen(!isOpen)}
					type='button'
				>
					{title}
					<ArrowDownIcon className={twMerge('transition', isOpen && 'rotate-180')} />
				</button>
			</div>
			<div
				className={twMerge('transition-500 overflow-hidden transition-[max-height]')}
				style={{
					maxHeight: `${contentHeight}px`,
					transitionDuration: '0.2s',
					overflow: `${overflowStyle}`,
					display: `${displayStyle}`
				}}
			>
				<div ref={accordionContentRef} className='pt-4 xl:pt-[1.62rem]'>
					{children}
				</div>
			</div>
		</div>
	)
}
