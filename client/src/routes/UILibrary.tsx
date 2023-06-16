import { ReactElement } from 'react'
import { Button, TableBody, TableWrapper, Table } from '../ui'
import { UsersTableWithTitle } from '../components'
import { ratingTableSchema } from '../helpers/tableSchema'
import { usersMock } from '../mock/usersData'

const usersTable = ratingTableSchema(usersMock)

export const UILibrary = (): ReactElement => {
	const clickHandler = (): void => {}
	return (
		<div className='container m-auto p-5 md:px-7 lg:px-10 '>
			<h2 className='mb-5 text-xl font-semibold'>Кнопки</h2>
			<div className='flex flex-col gap-2'>
				<div className='flex gap-2'>
					<Button onClick={clickHandler} type='primary'>
						Button
					</Button>
					<Button onClick={clickHandler} type='outlined'>
						Button
					</Button>
					<Button onClick={clickHandler} type='ghost'>
						Button
					</Button>
				</div>

				<div className='flex gap-2'>
					<Button onClick={clickHandler} type='primary' loading>
						Button
					</Button>
					<Button onClick={clickHandler} type='outlined' loading>
						Button
					</Button>
					<Button onClick={clickHandler} type='ghost' loading>
						Button
					</Button>
				</div>
				<div className='flex gap-2'>
					<Button onClick={clickHandler} type='primary' disabled>
						Button
					</Button>
					<Button onClick={clickHandler} type='outlined' disabled>
						Button
					</Button>
					<Button onClick={clickHandler} type='ghost' disabled>
						Button
					</Button>
				</div>
			</div>
			<hr className='my-8' />
			<h2 className='mb-8 text-xl font-semibold'>Таблица</h2>
			<TableWrapper>
				<h2
					className='py-[18px] text-base font-normal font-medium
				text-black md:pb-[26px] md:text-xl
				md:font-semibold lg:text-2xl
				2xl:text-[32px]
				'
				>
					Таблица
				</h2>
				<Table>
					<TableBody rows={usersTable} />
				</Table>
			</TableWrapper>
			<hr className='my-8' />
			<UsersTableWithTitle rows={usersTable} title='Список пользователей' />
		</div>
	)
}
