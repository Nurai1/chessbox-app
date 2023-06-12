/* eslint-disable react/function-component-definition */

import { RequestResponse } from 'api/apiRequest'
import { useGetAtomAsyncData } from 'hooks/useGetAtomAsyncData'
import { Atom } from 'jotai'
import { AtomFamily } from 'jotai/vanilla/utils/atomFamily'
import { memo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Input, Label, SpinnerSuspense } from 'ui'

type SearchQueryListPropsType<T> = {
	onChange: (value: T) => void
	queryAtom: Atom<Promise<RequestResponse<T[]>> | RequestResponse<T[]>>
	getOptionValue: (value: T) => string
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	getOptionId: (value: T) => string
}

function SearchQueryList<T>({
	queryAtom,
	onChange,
	getOptionValue,
	setOpen,
	getOptionId
}: SearchQueryListPropsType<T>) {
	const searchData = useGetAtomAsyncData(queryAtom)
	const [chosenId, setChosenId] = useState<string>()

	return (
		<div className='flex w-full flex-wrap'>
			{searchData.data?.map(option => {
				const id = getOptionId(option)
				const isChosenOption = id === chosenId

				const onOptionClick = () => {
					onChange(option)
					setChosenId(id)
					setOpen(false)
				}

				return (
					<button
						className={twMerge(
							'relative flex h-9 w-full items-center rounded px-3 text-left hover:bg-gray-100',
							isChosenOption && 'bg-gray-100'
						)}
						type='button'
						key={id}
						onClick={onOptionClick}
					>
						<span
							className={twMerge(
								'inline-flex h-4 w-4 items-center justify-center rounded-full border',
								isChosenOption && 'border-0 bg-blue-500'
							)}
						>
							<span className='inline-block h-[7px] w-[7px] rounded-full bg-white' />
						</span>

						<span className='pl-3 text-sm'>{getOptionValue(option)}</span>
					</button>
				)
			})}
		</div>
	)
}

export type SearchSelectPropsType<T> = {
	label?: string
	isRequired?: boolean
	placeholder?: string
	validationErrorText?: string
	onChange: (value: T) => void
	queryAtomFamily: AtomFamily<
		{ filter: { searchParam?: string } },
		Atom<Promise<RequestResponse<T[]>> | RequestResponse<T[]>>
	>
	getOptionValue: (value: T) => string
	getOptionId: (value: T) => string
}

function NoMemoSearchQuerySelect<T>({
	label,
	onChange,
	placeholder,
	isRequired,
	validationErrorText,
	queryAtomFamily,
	getOptionValue,
	getOptionId
}: SearchSelectPropsType<T>) {
	const [searchValue, setSearchValue] = useState<string>()
	const [open, setOpen] = useState(false)

	return (
		<div className='flex w-full flex-wrap text-sm font-medium leading-none'>
			<Label label={label} showOptional={!isRequired} />
			<div className={twMerge('relative w-full')}>
				<div className='relative w-full'>
					<Input
						classes='h-16'
						isSearch
						loopPosition='right'
						value={searchValue}
						onChange={searchVal => {
							if (searchVal && !open) {
								setOpen(true)
							}
							if (!searchVal) {
								setOpen(false)
							}

							setSearchValue(searchVal)
						}}
						placeholder={placeholder}
						validationErrorText={validationErrorText}
					/>
				</div>
				<div
					className={twMerge(
						'duration opacity-1 !absolute z-20 mt-2 box-border max-h-[50vh] w-full min-w-[15rem] translate-y-0 overflow-y-auto rounded-lg bg-white p-2 shadow-md transition-[opacity,margin]',
						!open ? 'hidden' : 'animate-show-bottom'
					)}
				>
					<SpinnerSuspense classes='h-36'>
						<SearchQueryList
							setOpen={setOpen}
							getOptionValue={getOptionValue}
							getOptionId={getOptionId}
							onChange={value => {
								setSearchValue(getOptionValue(value))
								onChange(value)
							}}
							queryAtom={queryAtomFamily({ filter: { searchParam: searchValue } })}
						/>
					</SpinnerSuspense>
				</div>
			</div>
		</div>
	)
}

export const SearchQuerySelect = memo(NoMemoSearchQuerySelect, (prevProps, nextProps) => {
	if (
		prevProps.isRequired === nextProps.isRequired &&
		prevProps.label === nextProps.label &&
		prevProps.onChange === nextProps.onChange &&
		prevProps.placeholder === nextProps.placeholder &&
		prevProps.queryAtomFamily === nextProps.queryAtomFamily &&
		prevProps.validationErrorText === nextProps.validationErrorText
	) {
		return true
	}
	return false
}) as typeof NoMemoSearchQuerySelect
