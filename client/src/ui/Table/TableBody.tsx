/* eslint-disable react/no-array-index-key */
import { FC, ReactNode, useEffect } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { BreakPoint } from 'src/constants/breakPoints'
import { twMerge } from 'tailwind-merge'
import { useWindowSize } from 'usehooks-ts'
import { Loader } from '../Loader'

export type TablePropsType =
	| {
			columns?: { node: string; width?: number | string; classes?: string }[]
			rows: { cells: { node: ReactNode; classes?: string }[] }[]
			isInfiniteLoader?: false
			hasNextPage?: never
			isNextPageLoading?: never
			loadNextPage?: never
			classes?: string
	  }
	| {
			columns?: { node: string; width?: number | string; classes?: string }[]
			rows: { cells: { node: ReactNode; classes?: string }[] }[]
			isInfiniteLoader: true
			hasNextPage?: boolean
			isNextPageLoading?: boolean
			loadNextPage?: () => void
			classes?: string
	  }

type AutoSizerProps = { height: number; width: number }

let isInfinityLoaderMounted = false

export const TableBody: FC<TablePropsType> = ({
	columns,
	rows,
	isInfiniteLoader,
	hasNextPage,
	isNextPageLoading,
	loadNextPage,
	classes
}) => {
	const itemCount = hasNextPage ? rows.length + 1 : rows.length

	// Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
	const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage
	const { width: screenWidth } = useWindowSize()

	useEffect(() => {
		if (isInfinityLoaderMounted) {
			const scrollList = document.querySelector('.js-infinity-loader')
			document.addEventListener('wheel', event => {
				if (!(event.target as HTMLElement).closest('.js-infinity-loader')) {
					scrollList?.scrollBy(event.deltaX, event.deltaY)
				}
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInfinityLoaderMounted])

	const isItemLoaded = (index: number) => !hasNextPage || index < rows.length

	return (
		<div className={`grow ${classes}`}>
			{isInfiniteLoader && (
				<AutoSizer>
					{(props: AutoSizerProps) => (
						// типизировал так, потому что интерфейс пропса loadMoreItems не соотвтетсвует интерфесу нашей функции
						<InfiniteLoader
							isItemLoaded={index => {
								isInfinityLoaderMounted = true
								return isItemLoaded(index)
							}}
							itemCount={itemCount}
							loadMoreItems={loadMoreItems as (startIndex: number, stopIndex: number) => Promise<void> | void}
						>
							{({ onItemsRendered, ref }) => (
								<FixedSizeList
									itemCount={itemCount}
									onItemsRendered={onItemsRendered}
									ref={ref}
									itemSize={screenWidth >= BreakPoint.Lg ? 64 : 80}
									height={props.height}
									width={props.width}
									className='scroll-custom js-infinity-loader'
								>
									{({ index, style }) =>
										!isItemLoaded(index) ? (
											<div key={index} style={style}>
												<Loader classes='scale-75 h-full' />
											</div>
										) : (
											<div key={index} style={style} className='flex md:!w-[99%]'>
												{rows[index].cells.map((cell, cellIndex) => {
													const column = columns ? columns[cellIndex] : null
													return (
														<div
															key={cellIndex}
															className={twMerge(
																'inline-flex min-w-0 border-t px-2.5 py-[14px] text-sm font-normal text-grey first:pl-0 last:pr-0 md:py-[22px] md:text-base 2xl:py-[24px]',
																cell.classes
															)}
															style={{
																flexGrow: column?.width ? 0 : 1,
																flexBasis: column?.width || '0px',
																width: column?.width
															}}
														>
															{cell.node}
														</div>
													)
												})}
											</div>
										)
									}
								</FixedSizeList>
							)}
						</InfiniteLoader>
					)}
				</AutoSizer>
			)}

			{!isInfiniteLoader &&
				rows.map((row, rowIndex) => {
					return (
						<div key={rowIndex} className='flex'>
							{row.cells.map((cell, cellIndex) => {
								const column = columns ? columns[cellIndex] : null
								return (
									<div
										key={cellIndex}
										className={twMerge(
											'inline-flex min-w-0 border-t px-2.5 py-[14px] text-sm font-normal text-grey first:pl-0 last:pr-0 md:py-[22px] md:text-base 2xl:py-[24px]',
											cell.classes
										)}
										style={{
											flexGrow: column?.width ? 0 : 1,
											flexBasis: column?.width || '0px',
											width: column?.width
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
	)
}
