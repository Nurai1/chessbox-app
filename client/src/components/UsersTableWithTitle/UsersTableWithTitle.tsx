import { FC, ReactNode } from 'react'
import { TableWrapper, TableBody, TableHeader } from '../../ui'

type UsersTableWithTitlePropsType = {
	columns?: { title: string; width?: number | string; classes?: string }[]
	rows: { cells: { node: ReactNode; classes?: string }[] }[]
	title?: string
}

const columnsDefault = [
	{ title: 'Place', classes: 'max-w-[50px] md:max-w-[70px] lg:max-w-[100px]' },
	{ title: 'Name', classes: '!grow-[2] xl:!grow-[1]' },
	{ title: 'Location', classes: 'hidden xl:flex' },
	{ title: 'Points', classes: '2xl:min-w-[45%] xl:min-w-[40%]' }
]

export const UsersTableWithTitle: FC<UsersTableWithTitlePropsType> = ({ columns = columnsDefault, rows, title }) => {
	return (
		<TableWrapper>
			{title && (
				<h2
					className='border-b py-[18px] text-base font-normal font-medium
				text-black md:pb-[26px] md:text-xl
				md:font-semibold lg:text-2xl
				2xl:text-[32px]
				'
				>
					{title}
				</h2>
			)}
			<table className='relative w-full'>
				<TableHeader columns={columns} />
				<TableBody rows={rows} />
			</table>
		</TableWrapper>
	)
}
