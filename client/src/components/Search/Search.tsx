import { ChangeEvent, FC, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ReactComponent as Settings } from 'src/assets/settings.svg'
import { Tag, Input, Modal, Button } from 'src/ui'
import { UserFilter } from '../UserFilter'

type SearchPropsType = {
	classes?: string
}

const hasFilter = true

export const Search: FC<SearchPropsType> = ({ classes }) => {
	const [searchValue, setSearchValue] = useState('')
	const [filterValues, setFilterValues] = useState({
		ageFrom: '',
		ageTo: '',
		weightFrom: '',
		weightTo: ''
	})
	const [isModalOpen, setIsModalOpen] = useState(false)
	const handleSearchInput = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
		setSearchValue(event.target.value)
	}

	const handleFilter = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = event.target

		setFilterValues({
			...filterValues,
			[name]: value
		})
	}

	const handleModalOpen = () => {
		setIsModalOpen(!isModalOpen)
	}

	return (
		<div className={twMerge('', classes)}>
			<div className={twMerge('flex items-center gap-[20px]')}>
				<Input onChange={handleSearchInput} value={searchValue} isSearch placeholder='Search users' />
				<button
					onClick={handleModalOpen}
					className={`relative transition hover:opacity-70 ${
						hasFilter &&
						'before:absolute before:right-0 before:top-[-3px] before:h-[11px] before:w-[11px] before:rounded-full before:bg-[#FB1616]'
					}`}
					type='button'
				>
					<Settings />
				</button>
			</div>
			{hasFilter && (
				<div className='mx-[-16px] mt-[20px] overflow-x-auto md:mx-[-40px] lg:mx-[0]'>
					<div className='ml-[16px] flex gap-[10px] md:ml-[40px] lg:mx-[0] lg:flex-wrap'>
						<Tag type='search' text='Woman' />
						<Tag type='search' text='Man' />
						<Tag type='search' text='60-75 kg' />
						<Tag type='search' text='60-75 kg' />
						<Tag type='search' text='60-75 kg' />
						<Tag type='search' text='60-75 kg' />
						<Tag type='search' text='60-75 kg' />
						<Tag type='search' text='60-75 kg' />
						<Tag type='search' text='60-75 kg' />
					</div>
				</div>
			)}
			<Modal
				isOpen={isModalOpen}
				onClose={handleModalOpen}
				title='Filter'
				content={<UserFilter onChange={handleFilter} inputValues={filterValues} />}
				submitButton={
					<Button type='primary' classes='w-full' onClick={() => null}>
						Show
					</Button>
				}
			/>
		</div>
	)
}
