import { FC } from 'react'
import { TableBody, TableHeader } from 'src/ui'
import { TablePropsType } from 'src/ui/Table/TableBody'
import { twMerge } from 'tailwind-merge'
import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'

type UsersTableWithTitlePropsType = {
	title?: string
	classes?: string
} & TablePropsType

// sm:min-w-[7.5rem]
export const UsersTableWithTitle: FC<UsersTableWithTitlePropsType> = ({ columns, rows, title, classes, ...rest }) => {
	const { t } = useOptionalTranslation()
	const columnsDefault = [
		{ node: t('place'), classes: 'max-w-[3rem] lg:max-w-[5rem] xl:max-w-[6.875rem]' },
		{ node: t('name'), classes: 'lg:max-w-none xl:max-w-[15rem]' },
		{ node: `${t('age')} & ${t('weight')}`, classes: 'max-w-[11rem] hidden xl:flex' },
		{ node: t('location'), classes: 'hidden lg:flex' },
		{ node: t('points'), classes: '!grow-0 md:min-w-[6.25rem] lg:min-w-[10rem] xl:min-w-[10.4rem]' }
	]
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
				<TableHeader columns={columns ?? columnsDefault} />
				<TableBody rows={rows} {...rest} />
			</div>
		</>
	)
}
