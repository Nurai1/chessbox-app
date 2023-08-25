import { FC, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import { XYCoord, useDrag, useDrop } from 'react-dnd'
import { twMerge } from 'tailwind-merge'

type DragSortItemPropsType = {
	children: ReactNode
	sortItems: (dragIndex: number, hoverIndex: number) => void
	index: number
	classes?: string
}

type DragItem = {
	index: number
	id: string
	type: string
}

export const DragSortItem: FC<DragSortItemPropsType> = ({ children, sortItems, index, classes }): ReactElement => {
	const ref = useRef<HTMLDivElement>(null)
	const dragElementRef = ref.current
	const [touched, setTouched] = useState(false)
	const [{ isDragging }, drag] = useDrag({
		type: 'DRAG_N_DROP_KEY',
		item: () => ({ index }),
		collect: monitor => ({
			isDragging: monitor.isDragging()
		})
	})

	useEffect(() => {
		const touchStart = () => setTouched(true)
		const touchEnd = () => setTouched(false)

		dragElementRef?.addEventListener('touchstart', touchStart)
		dragElementRef?.addEventListener('touchend', touchEnd)

		return () => {
			dragElementRef?.removeEventListener('touchstart', touchStart)
			dragElementRef?.removeEventListener('touchstart', touchEnd)
		}
	})

	const [, drop] = useDrop<DragItem, void, { isOver: boolean }>({
		accept: 'DRAG_N_DROP_KEY',
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
				isOver: monitor.isOver()
			}
		},
		hover(item: DragItem, monitor) {
			if (!dragElementRef) {
				return
			}

			const dragIndex = item.index
			const hoverIndex = index as number

			// Don't replace items with themselves
			if (dragIndex === hoverIndex) {
				return
			}

			// Determine rectangle on screen
			const hoverBoundingRect = dragElementRef?.getBoundingClientRect()

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

	return (
		<div
			className={twMerge('hover:cursor-move', isDragging && 'opacity-20', touched && 'opacity-20', classes)}
			ref={ref}
		>
			{children}
		</div>
	)
}
