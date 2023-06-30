/* eslint-disable react/no-array-index-key */
import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import AutoSizer from "react-virtualized-auto-sizer";

export type TablePropsType = {
	columns?: { title: string; width?: number | string; classes?: string }[]
	rows: { cells: { node: ReactNode; classes?: string }[] }[]
	isInfiniteLoader?: boolean;
	itemsCount?: number
	loadMoreItems?: (startIndex: number, stopIndex: number) => void
	isItemLoaded?: (index: number) => boolean
}

export const TableBody: FC<TablePropsType> = ({
	columns,
	rows,
	isInfiniteLoader,
	itemsCount,
	loadMoreItems,
	isItemLoaded,
}) => {
	return (
		<tbody>
		{isInfiniteLoader &&
					<InfiniteLoader
						isItemLoaded={isItemLoaded as (index: number) => boolean}
						loadMoreItems={loadMoreItems as any}
						itemCount={itemsCount as number}
					>
						{({ onItemsRendered, ref }) => (
							<FixedSizeList
								className='w-full'
								itemCount={itemsCount as number}
								itemSize={35}
								height={300}
								width={900}
								ref={ref}
								onItemsRendered={onItemsRendered}
							>
								{({index}) => (
									<tr key={index} className='flex'>
										{rows[index].cells.map((cell, cellIndex) => {
											const column = columns ? columns[cellIndex] : null
											return (
												<td
													key={cellIndex}
													className={twMerge(
														'inline-flex min-w-0 border-t px-2.5 py-[14px] text-sm font-normal text-[#6C6A6C] first:pl-0 last:pr-0 md:py-[22px] md:text-base 2xl:py-[24px]',
														cell.classes
													)}
													style={{
														flexGrow: column?.width ? 0 : 1,
														flexBasis: column?.width || '0px',
														width: column?.width
													}}
												>
													{cell.node}
												</td>
											)
										})}
									</tr>
								)}
							</FixedSizeList>
						)}
					</InfiniteLoader>

			}
		
		{!isInfiniteLoader && rows.map((row, rowIndex) => {
				return (
					<tr key={rowIndex} className='flex'>
						{row.cells.map((cell, cellIndex) => {
							const column = columns ? columns[cellIndex] : null
							return (
								<td
									key={cellIndex}
									className={twMerge(
										'inline-flex min-w-0 border-t px-2.5 py-[14px] text-sm font-normal text-[#6C6A6C] first:pl-0 last:pr-0 md:py-[22px] md:text-base 2xl:py-[24px]',
										cell.classes
									)}
									style={{
										flexGrow: column?.width ? 0 : 1,
										flexBasis: column?.width || '0px',
										width: column?.width
									}}
								>
									{cell.node}
								</td>
							)
						})}
					</tr>
				)
			})
		}
		</tbody>
	)
}
