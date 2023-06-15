import { ReactElement } from 'react'
import { Button, Table, TableWrapper } from '../ui'
import { tableDataMock } from "../mock/table";

export const UILibrary = (): ReactElement => {
	const clickHandler = (): void => {}
	return (
		<div className='container m-auto lg:px-10 md:px-7 p-5 '>
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
			<hr className='my-8'/>
			<h2 className='mb-8 text-xl font-semibold'>Таблица</h2>
			<TableWrapper>
				<h2 className='text-base font-normal text-black py-[18px] border-b border-[#DADADA]
				md:text-xl md:pb-[26px] font-medium
				lg:text-2xl md:font-semibold
				2xl:text-[32px]
				'>{tableDataMock.title}</h2>
				<Table columns={tableDataMock.columns}  rows={tableDataMock.rows} />
			</TableWrapper>
		</div>

	)
}
