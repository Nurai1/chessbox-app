import { FC, useState, useRef, useEffect, ReactNode } from 'react'
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
	const [contentHeight, setContentHeight] = useState<number>()
	const accordionContentRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (accordionContentRef.current && isOpen) {
			setTimeout(() => setContentHeight(accordionContentRef.current?.clientHeight))
		} else {
			setContentHeight(0)
		}
	}, [isOpen, children])

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
					<ArrowDownIcon className={twMerge('ml-auto transition', isOpen && 'rotate-180')} />
				</button>
				{additionalIcon}
			</div>
			<div
				className={twMerge('overflow-hidden transition-[max-height]', isOpen && 'overflow-visible')}
				style={{
					maxHeight: `${contentHeight}px`
				}}
			>
				<div ref={accordionContentRef} className='pt-4 xl:pt-[1.62rem]'>
					{children}
				</div>
			</div>
		</div>
	)
}
