import { FC, ReactElement, useState, useRef, useEffect } from 'react'
import { ReactComponent as DragIcon } from 'src/assets/drag-icon.svg'
import { ReactComponent as ArrowDownIcon } from 'src/assets/arrow-down-big.svg'
import { twMerge } from 'tailwind-merge'
import { XYCoord, useDrag, useDrop } from 'react-dnd'

type AccordionPropsType =
	| {
			children: ReactElement
			title: ReactElement
			classes?: string
			isOpenDefault?: boolean
			isDraggable?: false
			id?: never
			index?: never
			sortItems?: never
			closeAccordion?: never
	  }
	| {
			children: ReactElement
			title: ReactElement
			classes?: string
			isOpenDefault?: boolean
			isDraggable: true
			id?: string
			index: number
			sortItems?: (dragIndex: number, hoverIndex: number) => void
			closeAccordion?: (value: boolean) => void
	  }

type DragItem = {
	index: number
	id: string
	type: string
}

const DRAG_N_DROP_KEY = 'accordion'

export const Accordion: FC<AccordionPropsType> = ({
	children,
	title,
	isDraggable,
	classes,
	isOpenDefault = false,
	id,
	index,
	sortItems,
	closeAccordion
}) => {
	const [isOpen, setIsOpen] = useState(isOpenDefault)
	const [contentHeight, setContentHeight] = useState<number>()
	const [overflowStyle, setOverflowStyle] = useState('hidden')
	const [displayStyle, setDisplayStyle] = useState('none')
	const [isHovering, setIsHovering] = useState(false)
	const accordionContentRef = useRef<HTMLDivElement | null>(null)
	const ref = useRef<HTMLDivElement>(null)

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

	useEffect(() => {
		setIsHovering(false)
	}, [sortItems])

	const [{ isDragging }, drag] = useDrag({
		type: DRAG_N_DROP_KEY,
		item: () => ({ id, index }),
		collect: monitor => ({
			isDragging: monitor.isDragging()
		})
	})

	const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
		accept: DRAG_N_DROP_KEY,
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
				isOver: monitor.isOver()
			}
		},
		hover(item: DragItem, monitor) {
			if (!ref.current || isOpen) {
				return
			}

			const dragIndex = item.index
			const hoverIndex = index as number

			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return
			}

			// Determine rectangle on screen
			const hoverBoundingRect = ref.current?.getBoundingClientRect()

			// Get vertical middle
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

			// Determine mouse position
			const clientOffset = monitor.getClientOffset()

			// Get pixels to the top
			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return
			}

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return
			}

			// Time to actually perform the action
			sortItems?.(dragIndex, hoverIndex)

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex
		}
	})

	drag(drop(ref))

	const accordionContent = () => (
		<>
			<div className='flex items-center'>
				{isDraggable && (
					<DragIcon
						className={twMerge('js-drag-icon mr-5', isOpen ? 'hover:cursor-pointer' : 'hover:cursor-move')}
						onClick={() => {
							if (isOpen) {
								closeAccordion(false)
							}
						}}
					/>
				)}
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
		</>
	)

	return (
		<>
			{isDraggable && (
				<div
					className={twMerge(
						'relative py-4 xl:py-[1.62rem] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-300',
						classes,
						isDragging && 'opacity-20',
						isHovering && 'before:absolute before:top-0 before:h-0.5 before:w-full before:bg-black'
					)}
					ref={ref}
				>
					{accordionContent()}
				</div>
			)}

			{!isDraggable && (
				<div
					className={twMerge(
						'py-4 xl:py-[1.62rem] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-300',
						classes
					)}
				>
					{accordionContent()}
				</div>
			)}
		</>
	)
}
