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
						'flex min-h-[50px] items-center p-2.5 text-sm font-medium uppercase text-gray-500 first:pl-0 last:pr-0 md:min-h-[85px] lg:text-xl',
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
