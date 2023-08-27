/* eslint-disable react/no-array-index-key */
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

export type TableHeaderPropsType = {
	columns: { title: string; width?: number | string; classes?: string }[]
}

export const TableHeader: FC<TableHeaderPropsType> = ({ columns }) => {
	return (
		<div className='flex'>
			{columns.map((column, idx) => (
				<div
					key={idx}
					className={twMerge(
						'mb-2 flex h-10 items-center p-2 text-sm font-medium uppercase text-grey first:pl-0 lg:first:pl-2 xl:first:pl-5',
						column.classes
					)}
					style={{
						flexGrow: column.width ? 0 : 1,
						flexBasis: column.width || '0px',
						width: column.width
					}}
				>
					{column.title}
				</div>
			))}
		</div>
	)
}
