import { FC, ReactNode } from 'react'
import { TableBody, TableHeader } from '../../ui'

type UsersTableWithTitlePropsType = {
	rows: { cells: { node: ReactNode; classes?: string }[] }[]
	columns?: { title: string; width?: number | string; classes?: string }[]
	title?: string
	isInfiniteLoader?: boolean
	hasNextPage?: boolean
	isNextPageLoading?: boolean
	loadNextPage?: () => void
}

const columnsDefault = [
	{ title: 'Place', classes: 'max-w-[50px] md:max-w-[70px] lg:max-w-[100px]' },
	{ title: 'Name', classes: '!grow-[2] xl:!grow-[1]' },
	{ title: 'Location', classes: 'hidden xl:flex' },
	{ title: 'Points', classes: '2xl:min-w-[45%] xl:min-w-[40%]' }
]

export const UsersTableWithTitle: FC<UsersTableWithTitlePropsType> = ({
	columns = columnsDefault,
	rows,
	title,
	...rest
}) => {
	return (
		<>
			{title && (
				<h2
					className='border-b py-[18px] text-base font-medium
				text-black md:pb-[26px] md:text-xl
				md:font-semibold lg:text-2xl
				2xl:text-[32px]
				'
				>
					{title}
				</h2>
			)}
			<div className='relative flex w-full grow flex-col'>
				<TableHeader columns={columns} />
				<TableBody rows={rows} {...rest} />
			</div>
		</>
	)
}
