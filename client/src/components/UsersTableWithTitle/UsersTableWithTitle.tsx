import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { TableBody, TableHeader } from 'src/ui'
import { TablePropsType } from 'src/ui/Table/TableBody'

type UsersTableWithTitlePropsType = {
	title?: string
	classes?: string
} & TablePropsType

const columnsDefault = [
	{ title: 'Place', classes: 'max-w-[3rem] lg:max-w-[5rem] xl:max-w-[6.875rem]' },
	{ title: 'Name', classes: 'lg:max-w-none xl:max-w-[15rem]' },
	{ title: 'Age & Weight', classes: 'max-w-[11rem] hidden xl:flex' },
	{ title: 'Location', classes: 'hidden lg:flex' },
	{ title: 'Points', classes: '!grow-0 md:min-w-[6.25rem] lg:min-w-[10rem] xl:min-w-[10.4rem]' }
]
// sm:min-w-[7.5rem]
export const UsersTableWithTitle: FC<UsersTableWithTitlePropsType> = ({
	columns = columnsDefault,
	rows,
	title,
	classes,
	...rest
}) => {
	return (
		<>
			{title && (
				<h2
					className='border-b py-[18px] text-base font-medium
				text-black md:pb-[26px] md:text-xl
				md:font-semibold lg:text-2xl
				2xl:text-[32px]'
				>
					{title}
				</h2>
			)}
			<div className={twMerge('relative flex w-full grow flex-col', classes)}>
				<TableHeader columns={columns} />
				<TableBody rows={rows} {...rest} />
			</div>
		</>
	)
}
