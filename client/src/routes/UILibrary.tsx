import { useState, FC } from 'react'
import { ReactComponent as Banknote } from 'src/assets/banknote.svg'
import { ReactComponent as Persons } from 'src/assets/persons.svg'
import { ratingTableSchema } from 'src/helpers/tableSchemas/tableSchema'
import {
	Button,
	HorizontalTabs,
	TableBody,
	RoundedBorderWrapper,
	Tag,
	Timer,
	Loader,
	CheckboxAndRadioButton,
	Accordion
} from '../ui'
import { UsersTableWithTitle, CompetitionCard } from '../components'
import { usersMock, competitionsMock } from '../mock'

const usersTable = ratingTableSchema(usersMock)
const tabsContent = ['Active competitions', 'My competitions', 'Archive']
export const UILibrary: FC = () => {
	const [activeIndex, setActiveIndex] = useState(0)
	const [checked, setChecked] = useState(true)
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
						onClick: () => setActiveIndex(0)
					},
					{
						isActive: activeIndex === 1,
						title: 'My competitions',
						onClick: () => setActiveIndex(1)
					},
					{
						isActive: activeIndex === 2,
						title: 'Archive',
						onClick: () => setActiveIndex(2)
					}
				]}
			/>
			<h3 className='mt-2'>{tabsContent[activeIndex]}</h3>
			<hr className='my-8' />

			<h2 className='mb-5 text-xl font-semibold'>Таймер</h2>
			<Timer time='2023-06-29T07:39:00.000Z' />

			<hr className='my-8' />

			<h2 className='mb-5 text-xl font-semibold'>Тэги</h2>
			<div className='mt-4 flex flex-wrap gap-4 '>
				<Tag img={<Banknote className='max-5' />} text='888' />
				<Tag img={<Persons className='max-5' />} text='426 participants enrolled' />
				<Tag type='search' text='Woman' />
				<Tag type='search' text='60-75 kg' />
			</div>
			<hr className='my-8' />

			<h2 className='mb-5 text-xl font-semibold'>Лоадер</h2>
			<Loader />
			<hr className='my-8' />

			<h2 className='mb-5 text-xl font-semibold'>Чекбокс</h2>
			<CheckboxAndRadioButton
				title='Choose something'
				type='checkbox'
				name='something'
				checked={checked}
				classes='mr-5'
				onChange={() => setChecked(!checked)}
			/>
			<CheckboxAndRadioButton type='checkbox' title='Disabled' name='disabled' onChange={() => ''} disabled />
			<hr className='my-8' />

			<h2 className='mb-8 text-xl font-semibold'>Таблица</h2>
			<RoundedBorderWrapper>
				<h2
					className='py-[18px] text-base font-medium
				text-black md:pb-[26px] md:text-xl
				md:font-semibold lg:text-2xl
				2xl:text-[32px]'
				>
					Таблица
				</h2>
				<div className='relative w-full'>
					<TableBody rows={usersTable} />
				</div>
			</RoundedBorderWrapper>
			<hr className='my-8' />

			<RoundedBorderWrapper>
				<UsersTableWithTitle rows={usersTable} title='Список пользователей' />
			</RoundedBorderWrapper>
			<hr className='my-8' />

			<h2 className='mb-5 text-xl font-semibold'>Карточка соревнования</h2>
			<div
				className='border-[#DADADA] lg:rounded-3xl lg:border lg:px-[30px] lg:py-[15px]
			xl:px-[25px]
			2xl:px-[9px]'
			>
				<CompetitionCard competition={competitionsMock[0]} />
				<CompetitionCard competition={competitionsMock[1]} />
				<CompetitionCard competition={competitionsMock[2]} />
				<CompetitionCard competition={competitionsMock[3]} />
			</div>
			<hr className='my-8' />

			<h2 className='mb-5 text-xl font-semibold'>Аккордеон</h2>
			<Accordion>
				<p>Accordion content</p>
				<ul>
					<li>
						This type is meant to model operations like await in async functions, or the .then() method on Promises -
						specifically, the way that they recursively unwrap Promises.
					</li>
					<li>
						Constructs a type with all properties of Type set to optional. This utility will return a type that
						represents all subsets of a given type.
					</li>
					<li>Constructs a type consisting of all properties of Type set to required. The opposite of Partial.</li>
					<li>
						Constructs a type with all properties of Type set to readonly, meaning the properties of the constructed
						type cannot be reassigned.
					</li>
					<li>
						Constructs an object type whose property keys are Keys and whose property values are Type. This utility can
						be used to map the properties of a type to another type.
					</li>
				</ul>
			</Accordion>
		</div>
	)
}
