import { FC, ReactElement, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ReactComponent as SettingsIcon } from 'src/assets/settings.svg'
import { useAppDispatch } from 'src/hooks/redux'
import { setUserFilter } from 'src/store/slices/usersSlice'
import { Tag, Input, Modal, Button } from 'src/ui'
import { UserFilter, UserFilterType } from '../UserFilter'

type SearchPropsType = {
	classes?: string
}

type FilterValuesType = {
	search?: string
} & UserFilterType

export const UsersSearch: FC<SearchPropsType> = ({ classes }) => {
	const [searchValue, setSearchValue] = useState<null | string>(null)
	const [filterValues, setFilterValues] = useState<FilterValuesType>({})
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [tags, setTags] = useState<ReactElement[] | []>([])
	const [validationError, setValidationError] = useState(false)
	const dispatch = useAppDispatch()

	const handleSearchInput = (value?: string) => {
		setSearchValue(value as string)
	}

	// debounce
	useEffect(() => {
		const searchByString = setTimeout(() => {
			if (searchValue === null) return
			const newValues = {
				...filterValues,
				search: searchValue
			}
			setFilterValues(newValues)
			dispatch(setUserFilter(newValues))
		}, 500)

		return () => clearTimeout(searchByString)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchValue])

	const handleFilter = (value?: string | boolean, name?: string) => {
		setFilterValues({
			...filterValues,
			[name as string]: value
		})
	}

	const createTags = (data: UserFilterType) => {
		const tagsData = []

		const updateState = (updateDValues: UserFilterType) => {
			const newValues = {
				...data,
				...updateDValues
			}
			setFilterValues(newValues)
			setTags(createTags(newValues))
			dispatch(setUserFilter(newValues))
		}

		if (data.ageFrom || data.ageTo) {
			tagsData.push(
				<Tag
					type='search'
					text={`${data.ageFrom ?? '0'}${data.ageFrom && !data.ageTo ? '+' : '-'}${data.ageTo ?? ''} years`}
					key='age'
					onClick={() =>
						updateState({
							ageFrom: undefined,
							ageTo: undefined
						})
					}
				/>
			)
		}

		if (data.weightFrom || data.weightTo) {
			tagsData.push(
				<Tag
					type='search'
					text={`${data.weightFrom ?? '0'}${data.weightFrom && !data.weightTo ? '+' : '-'}${data.weightTo ?? ''} kg`}
					key='weigh'
					onClick={() =>
						updateState({
							weightFrom: undefined,
							weightTo: undefined
						})
					}
				/>
			)
		}

		if (data.withMen) {
			tagsData.push(
				<Tag
					type='search'
					text='Man'
					key='withMen'
					onClick={() =>
						updateState({
							withMen: undefined
						})
					}
				/>
			)
		}

		if (data.withWomen) {
			tagsData.push(
				<Tag
					type='search'
					text='Woman'
					key='withWomen'
					onClick={() =>
						updateState({
							withWomen: undefined
						})
					}
				/>
			)
		}

		return tagsData
	}

	const handleModalOpen = () => {
		setIsModalOpen(!isModalOpen)
	}

	const handleClearFilter = () => {
		setFilterValues({
			search: searchValue ?? ''
		})
	}

	return (
		<div className={classes}>
			<div className={twMerge('flex items-center gap-[20px]')}>
				<Input
					onChange={handleSearchInput}
					value={searchValue ?? ''}
					isSearch
					placeholder='Search users'
					classes='h-12'
				/>
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
				content={
					<UserFilter onChange={handleFilter} inputValues={filterValues} setValidationError={setValidationError} />
				}
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
							setTags(createTags(filterValues))
							setIsModalOpen(false)
							dispatch(setUserFilter(filterValues))
						}}
						disabled={validationError}
					>
						Show
					</Button>
				}
			/>
		</div>
	)
}
