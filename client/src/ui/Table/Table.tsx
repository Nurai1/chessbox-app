/* eslint-disable react/no-array-index-key */
import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export type TablePropsType = {
	columns: { title: string; width?: number | string }[]
	rows: { cells: { node: ReactNode; classes?: string }[] }[]
}

export const Table: FC<TablePropsType> = ({ columns, rows }) => {
	return (
		<div className='relative'>
			<div className='rounded-md border border-gray-200'>
				<div className='flex rounded-t-md bg-gray-50'>
					{columns.map((column, idx) => (
						<div
							key={idx}
							className='inline-flex min-w-0 items-center border-r px-5 py-3 font-medium text-gray-500 last:border-r-0'
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
				{rows.map((row, rowIndex) => {
					return (
						<div key={rowIndex} className='flex'>
							{row.cells.map((cell, cellIndex) => {
								const column = columns[cellIndex]
								return (
									<div
										key={cellIndex}
										className={twMerge(
											'inline-flex min-h-[54px] min-w-0 border-t border-r px-5 py-3 text-sm font-medium last:border-r-0',
											cell.classes
										)}
										style={{
											flexGrow: column.width ? 0 : 1,
											flexBasis: column.width || '0px',
											width: column.width
										}}
									>
										{cell.node}
									</div>
								)
							})}
						</div>
					)
				})}
			</div>
		</div>
	)
}
