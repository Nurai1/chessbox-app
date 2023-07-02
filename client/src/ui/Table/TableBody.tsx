/* eslint-disable react/no-array-index-key */
import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import InfiniteLoader from 'react-window-infinite-loader'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

export type TablePropsType = {
	columns?: { title: string; width?: number | string; classes?: string }[]
	rows: { cells: { node: ReactNode; classes?: string }[] }[]
	isInfiniteLoader?: boolean
	hasNextPage: boolean
	isNextPageLoading: boolean
	loadNextPage: () => void
}

export const TableBody: FC<TablePropsType> = ({
	columns,
	rows,
	isInfiniteLoader,
	hasNextPage,
	isNextPageLoading,
	loadNextPage
}) => {
	const itemCount = hasNextPage ? rows.length + 1 : rows.length

	// Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
	const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage

	const isItemLoaded = (index: number) => !hasNextPage || index < rows.length

	return (
		<tbody>
			{isInfiniteLoader && (
				<InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
					{({ onItemsRendered, ref }) => (
						<FixedSizeList
							itemCount={itemCount}
							onItemsRendered={onItemsRendered}
							ref={ref}
							itemSize={105}
							height={450}
							width={900}
						>
							{({ index, style }) =>
								!isItemLoaded(index) ? (
									<tr key={index} style={style}>
										Loading...
									</tr>
								) : (
									<tr key={index} style={style} className='flex'>
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
								)
							}
						</FixedSizeList>
					)}
				</InfiniteLoader>
			)}

			{!isInfiniteLoader &&
				rows.map((row, rowIndex) => {
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
				})}
		</tbody>
	)
}
