import { FC, ReactElement, useState, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { ReactComponent as SettingsIcon } from 'src/assets/settings.svg'
import { useAppDispatch } from 'src/hooks/redux'
import { setUserFilter } from 'src/store/slices/usersSlice'
import { Tag, Input, Modal, Button } from 'src/ui'
import { UserFilter, UserFilterType } from '../UserFilter'

type SearchPropsType = {
	classes?: string
}

export const Search: FC<SearchPropsType> = ({ classes }) => {
	const [searchValue, setSearchValue] = useState('')
	const [filterValues, setFilterValues] = useState<UserFilterType>({})
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [tags, setTags] = useState<ReactElement[] | []>([])
	const dispatch = useAppDispatch()

	const handleSearchInput = (value?: string) => {
		setSearchValue(value as string)
	}

	const handleFilter = (value?: string | boolean, name?: string) => {
		if (typeof value === 'boolean') {
			setFilterValues({
				...filterValues,
				[name as string]: value
			})
			return
		}

		setFilterValues({
			...filterValues,
			[name as string]: Number(value)
		})
	}

	const createTags = () => {
		const tagsData = []

		if (filterValues.ageFrom || filterValues.ageTo) {
			tagsData.push(
				<Tag
					type='search'
					text={`${filterValues.ageFrom ?? ''}-${filterValues.ageTo ?? ''} years`}
					key='age'
					onClick={() => {
						const newValues = { ...filterValues }
						delete newValues.ageFrom
						delete newValues.ageTo
						setFilterValues(newValues)
					}}
				/>
			)
		}

		if (filterValues.weightFrom || filterValues.weightTo) {
			tagsData.push(
				<Tag
					type='search'
					text={`${filterValues.weightFrom ?? ''}-${filterValues.weightTo ?? ''} kg`}
					key='weigh'
					onClick={() => {
						const newValues = { ...filterValues }
						delete newValues.weightFrom
						delete newValues.weightTo
						setFilterValues(newValues)
					}}
				/>
			)
		}

		if (filterValues.withMen) {
			tagsData.push(
				<Tag
					type='search'
					text='Man'
					key='withMen'
					onClick={() => {
						const newValues = { ...filterValues }
						delete newValues.withMen
						setFilterValues(newValues)
					}}
				/>
			)
		}

		if (filterValues.withWomen) {
			tagsData.push(
				<Tag
					type='search'
					text='Woman'
					key='withWomen'
					onClick={() => {
						const newValues = { ...filterValues }
						delete newValues.withWomen
						setFilterValues(newValues)
					}}
				/>
			)
		}

		return tagsData
	}

	useEffect(() => {
		if (!isModalOpen) {
			setTags(createTags())
			dispatch(setUserFilter(filterValues))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterValues])

	const handleModalOpen = () => {
		setIsModalOpen(!isModalOpen)
	}

	const handleClearFilter = () => {
		setFilterValues({})
	}

	return (
		<div className={twMerge('', classes)}>
			<div className={twMerge('flex items-center gap-[20px]')}>
				<Input onChange={handleSearchInput} value={searchValue} isSearch placeholder='Search users' />
				<button
					onClick={handleModalOpen}
					className={`relative transition hover:opacity-70 ${
						tags.length > 0 &&
						'before:absolute before:right-0 before:top-[-3px] before:h-[11px] before:w-[11px] before:rounded-full before:bg-[#FB1616]'
					}`}
					type='button'
				>
					<SettingsIcon />
				</button>
			</div>
			{tags.length > 0 && (
				<div className='mx-[-16px] mt-[20px] overflow-x-auto md:mx-[-40px] lg:mx-[0]'>
					<div className='ml-[16px] flex gap-[10px] md:ml-[40px] lg:mx-[0] lg:flex-wrap'>{tags.map(tag => tag)}</div>
				</div>
			)}
			<Modal
				isOpen={isModalOpen}
				onClose={handleModalOpen}
				title='Filter'
				content={<UserFilter onChange={handleFilter} inputValues={filterValues} />}
				clearButton={
					<button onClick={handleClearFilter} type='button' className='text-base font-bold transition hover:opacity-70'>
						Clean up
					</button>
				}
				submitButton={
					<Button
						type='primary'
						classes='w-full'
						onClick={() => {
							setTags(createTags())
							setIsModalOpen(false)
							dispatch(setUserFilter(filterValues))
						}}
					>
						Show
					</Button>
				}
			/>
		</div>
	)
}
