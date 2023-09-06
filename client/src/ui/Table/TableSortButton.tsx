import { useState, FC, ReactNode } from 'react'
import { ReactComponent as ArrowDown } from 'src/assets/arrow-down-long.svg'
import { SortOrder } from 'src/constants/sortOrder'

type TableSortButtonPropsType = {
	children: ReactNode
	sortType: string
	onClick: (sortType: string, sortOrder: string) => void
	activeClass?: string
}

export const TableSortButton: FC<TableSortButtonPropsType> = ({children, sortType, onClick, activeClass}) => {
	const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC)
	const updateSortOrder = () => sortOrder === SortOrder.ASC ? setSortOrder(SortOrder.DESC) : setSortOrder(SortOrder.ASC)

	return (
		<button
			type="button"
			className={`flex gap-1 uppercase hover:opacity-70 transition ${activeClass}`}
			onClick={() => {
				onClick(sortType, sortOrder)
				updateSortOrder()
			}}>
			{children}
			<ArrowDown/>
		</button>
	)
}
