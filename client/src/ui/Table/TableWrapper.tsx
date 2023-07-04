import { FC, ReactNode } from 'react'

type TableWrapperPropsType = {
	children: ReactNode | ReactNode[]
}

export const TableWrapper: FC<TableWrapperPropsType> = ({ children }) => {
	return (
		<div className=' flex grow flex-col rounded-3xl border border-[#DADADA] p-3 md:px-5 lg:px-[50px]'>{children}</div>
	)
}
