import { FC, ReactNode } from 'react'

type TablePropsType = {
	children: ReactNode | ReactNode[]
}

export const Table: FC<TablePropsType> = ({ children }) => {
	return <table className='relative w-full'>{children}</table>
}
