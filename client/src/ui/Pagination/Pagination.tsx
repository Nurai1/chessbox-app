import { ReactComponent as ArrowDownIcon } from 'src/assets/arrow-down.svg'

import { FC, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

export type PaginationPropsType = {
	setOffset: React.Dispatch<React.SetStateAction<number>>
	offset: number
	total: number
	itemsPerPage: number
}

export const Pagination: FC<PaginationPropsType> = ({ setOffset, offset, total, itemsPerPage }) => {
	const totalPages = Math.ceil(total / itemsPerPage)
	const currentPage = offset / itemsPerPage + 1

	const paginationBtns = useMemo(() => {
		const buttons: { page?: number; isEllipsis?: boolean }[] = []

		if (!totalPages) return buttons

		if (currentPage > 5) {
			buttons.push({ page: 1 })
			buttons.push({ isEllipsis: true })
			buttons.push({ page: currentPage - 2 })
			buttons.push({ page: currentPage - 1 })
			buttons.push({ page: currentPage })
		} else {
			Array(currentPage)
				.fill(null)
				.forEach((_, index) => {
					buttons.push({ page: index + 1 })
				})
		}

		if (totalPages - currentPage > 4) {
			buttons.push({ page: currentPage + 1 })
			buttons.push({ page: currentPage + 2 })
			buttons.push({ isEllipsis: true })
			buttons.push({ page: totalPages })
		} else {
			Array(totalPages - currentPage)
				.fill(null)
				.forEach((_, index) => {
					buttons.push({ page: index + 1 + currentPage })
				})
		}

		return buttons
	}, [currentPage, totalPages])

	return totalPages > 1 ? (
		<nav className='my-4 inline-flex w-auto items-center divide-x divide-gray-200 rounded-full border-gray-200 bg-white drop-shadow-sm'>
			<button
				onClick={() => {
					if (currentPage !== 1) setOffset(offset - itemsPerPage)
				}}
				type='button'
				className='inline-flex-center h-10 w-10'
			>
				<span aria-hidden='true'>
					<ArrowDownIcon
						className={twMerge(
							currentPage !== 1 ? 'stroke-gray-500 hover:stroke-blue-600' : 'stroke-gray-200',
							'h-4 w-4 rotate-90'
						)}
					/>
				</span>
				<span className='sr-only'>Prev</span>
			</button>
			{paginationBtns.map(({ page, isEllipsis }, index) => {
				const isCurrentPage = currentPage === page
				const pageProps = isCurrentPage
					? { 'aria-current': 'page' as const }
					: {
							onClick: () => {
								if (page) setOffset((page - 1) * itemsPerPage)
							}
					  }

				if (isEllipsis) {
					return (
						// eslint-disable-next-line react/no-array-index-key
						<div key={index} className='inline-flex-center h-10 w-10 p-4 text-sm font-medium text-gray-500'>
							...
						</div>
					)
				}

				return (
					<button
						// eslint-disable-next-line react/no-array-index-key
						key={index}
						type='button'
						className={twMerge(
							isCurrentPage ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-blue-600',
							'inline-flex-center h-10 w-10 text-sm font-medium'
						)}
						{...pageProps}
					>
						{page}
					</button>
				)
			})}
			<button
				onClick={() => {
					if (currentPage !== totalPages) setOffset(offset + itemsPerPage)
				}}
				type='button'
				className='inline-flex-center h-10 w-10 text-gray-500 hover:text-blue-600'
			>
				<span className='sr-only'>Next</span>
				<span aria-hidden='true'>
					<ArrowDownIcon
						className={twMerge(
							currentPage !== totalPages ? 'stroke-gray-500 hover:stroke-blue-600' : 'stroke-gray-200',
							'h-4 w-4 -rotate-90'
						)}
					/>
				</span>
			</button>
		</nav>
	) : null
}
