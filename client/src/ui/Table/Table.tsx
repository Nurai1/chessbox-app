/* eslint-disable react/no-array-index-key */
import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export type TablePropsType = {
	columns: { title: string; width?: number | string, classes?: string  }[]
	rows: { cells: { node: ReactNode; classes?: string }[] }[]
}

export const Table: FC<TablePropsType> = ({ columns, rows }) => {
	return (
		<table className='relative w-full'>
			<thead>
				<tr className='flex'>
					{columns.map((column, idx) => (
						<th
							key={idx}
							className={twMerge(
								'flex items-center min-h-[50px] p-2.5 last:pr-0 first:pl-0 text-sm font-normal text-gray-500 uppercase md:font-bold  md:min-h-[85px] lg:font-medium lg:text-xl',
								column.classes
							)}
							style={{
								flexGrow: column.width ? 0 : 1,
								flexBasis: column.width || '0px',
								width: column.width
							}}
						>
							{column.title}
						</th>
					))}
				</tr>
			</thead>

			<tbody>
				{rows.map((row, rowIndex) => {
					return (
						<tr key={rowIndex} className='flex'>
							{row.cells.map((cell, cellIndex) => {
								const column = columns[cellIndex]
								return (
									<td
										key={cellIndex}
										className={twMerge(
											'inline-flex text-[#6C6A6C] min-w-0 border-t px-2.5 py-[14px] last:pr-0 first:pl-0 text-sm font-normal md:text-base md:py-[22px] 2xl:py-[24px]',
											cell.classes
										)}
										style={{
											flexGrow: column.width ? 0 : 1,
											flexBasis: column.width || '0px',
											width: column.width
										}}
									>
										{cell.node}
									</td>
								)
							})}
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}
