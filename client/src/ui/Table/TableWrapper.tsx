import { FC, ReactNode } from 'react'

type TableWrapperPropsType = {
	children: ReactNode | ReactNode[]
}

export const TableWrapper: FC<TableWrapperPropsType> = ({ children }) => {
	return (
		<div className='flex grow flex-col md:rounded-3xl md:border md:border-[#DADADA] md:px-[40px] md:pt-[33px] xl:pt-[63px]'>
			{children}
		</div>
	)
}
