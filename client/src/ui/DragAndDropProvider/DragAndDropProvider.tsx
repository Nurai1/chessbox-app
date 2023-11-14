import { FC, ReactElement, ReactNode } from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider } from 'react-dnd'
import { BreakPoint } from 'src/constants/breakPoints'
import { useWindowSize } from 'usehooks-ts'

type DragSortItemPropsType = {
	children: ReactNode
}

export const DragAndDropProvider: FC<DragSortItemPropsType> = ({ children }): ReactElement => {
	const { width } = useWindowSize()
	const screenWidth = width || window.outerWidth

	return <DndProvider backend={screenWidth < BreakPoint.Lg ? TouchBackend : HTML5Backend}>{children}</DndProvider>
}
