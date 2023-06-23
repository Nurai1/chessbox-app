import { ReactElement, useState } from 'react'
import { ReactComponent as Banknote } from 'assets/banknote.svg'
import { ReactComponent as Persons } from 'assets/persons.svg'
import { Button, HorizontalTabs, TableBody, TableWrapper, Tag, Timer } from '../ui'
import { UsersTableWithTitle, CompetitionCard } from '../components'
import { ratingTableSchema } from '../helpers/tableSchema'
import { usersMock, competitionsMock } from '../mock'

const usersTable = ratingTableSchema(usersMock)
const tabsContent = ['Active competitions', 'My competitions', 'Archive']
export const UILibrary = (): ReactElement => {
	const [activeIndex, setActiveIndex] = useState(0)
	const clickHandler = (): void => {}

	return (
		<div className='container m-auto p-[17px] md:px-7 lg:px-[41px]'>
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

			<h2 className='mb-5 text-xl font-semibold'>Табы</h2>
			<HorizontalTabs
				tabMinWidth='155'
				tabs={[
					{
						isActive: activeIndex === 0,
						title: 'Active',
						onClick: (idx: number) => setActiveIndex(idx)
					},
					{
						isActive: activeIndex === 1,
						title: 'My competitions',
						onClick: (idx: number) => setActiveIndex(idx)
					},
					{
						isActive: activeIndex === 2,
						title: 'Archive',
						onClick: (idx: number) => setActiveIndex(idx)
					}
				]}
			/>
			<h3 className='mt-2'>{tabsContent[activeIndex]}</h3>
			<hr className='my-8' />

			<h2 className='mb-5 text-xl font-semibold'>Таймер</h2>
			<Timer time='2023-06-29T07:39:00.000Z' />
			<br />
			<Timer time='2023-06-29T13:44:00.000+04:00' />
			<br />
			<Timer time='2023-06-29T12:45:00.000+04:00' />
			<hr className='my-8' />

			<h2 className='mb-5 text-xl font-semibold'>Тэги</h2>
			<div className='mt-4 flex flex-wrap gap-4 '>
				<Tag img={<Banknote className='max-5 mr-2' />} text='888' />
				<Tag img={<Persons className='max-5 mr-2' />} text='426 participants enrolled' />
			</div>
			<hr className='my-8' />

			<h2 className='mb-8 text-xl font-semibold'>Таблица</h2>
			<TableWrapper>
				<h2
					className='py-[18px] text-base font-medium
				text-black md:pb-[26px] md:text-xl
				md:font-semibold lg:text-2xl
				2xl:text-[32px]'
				>
					Таблица
				</h2>
				<table className='relative w-full'>
					<TableBody rows={usersTable} />
				</table>
			</TableWrapper>
			<hr className='my-8' />

			<UsersTableWithTitle rows={usersTable} title='Список пользователей' />
			<hr className='my-8' />

			<h2 className='mb-5 text-xl font-semibold'>Карточка соревнования</h2>
			<div
				className='border-[#DADADA] lg:rounded-3xl lg:border lg:px-[30px] lg:py-[15px]
			xl:px-[25px]
			2xl:px-[9px]'
			>
				<CompetitionCard competition={competitionsMock[0]} isParticipant={false} />
				<CompetitionCard competition={competitionsMock[1]} isParticipant />
				<CompetitionCard competition={competitionsMock[2]} isParticipant={false} />
				<CompetitionCard competition={competitionsMock[3]} isParticipant />
			</div>

			<hr className='my-8' />
		</div>
	)
}
