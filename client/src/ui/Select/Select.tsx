import { ReactComponent as ArrowDownIcon } from 'src/assets/arrow-down.svg'
import { ReactComponent as CheckMarkIcon } from 'src/assets/check-mark.svg'
import { ReactComponent as CrossIcon } from 'src/assets/cross.svg'
import { FC, memo, ReactNode, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Input, Label } from 'src/ui'

const getOptionById = (options: { renderNode?: ReactNode; value: string; id: string }[], id: string | undefined) =>
	options.find(option => option.id === id)

export type MultipleSelectProps = {
	multiple: true
	chosenIds: string[]
	chosenId?: never
	onChange: (value: string[]) => void
	menuOptions: { renderNode?: ReactNode; value: string; id: string }[]
}

export type SingleSelectProps = {
	multiple?: never
	chosenIds?: never
	chosenId: string | undefined
	onChange: (value: string) => void
	menuOptions: { value: string; id: string }[]
}

export type GeneralSelectProps = {
	label?: string
	isRequired?: boolean
	placeholder?: string
	withSearch?: boolean
	validationErrorText?: string
}

export type SelectPropsType = GeneralSelectProps & (MultipleSelectProps | SingleSelectProps)

export const Select: FC<SelectPropsType> = memo(function Select({
	label,
	onChange,
	placeholder,
	isRequired,
	chosenId,
	chosenIds,
	multiple,
	menuOptions,
	withSearch,
	validationErrorText
}) {
	const [searchValue, setSearchValue] = useState<string>()
	const visibleOptions = withSearch
		? menuOptions.filter(mOption => !searchValue || mOption.value.toLowerCase().includes(searchValue.toLowerCase()))
		: menuOptions

	const chosenSingleValue = getOptionById(menuOptions, chosenId)?.value
	const chosenOptions = chosenIds?.map(mId => getOptionById(menuOptions, mId))

	return (
		<div className='flex w-full flex-wrap text-sm font-normal leading-none'>
			<Label label={label} showOptional={false} />
			<div className={twMerge('hs-dropdown relative w-full', multiple && '[--auto-close:inside]')}>
				{multiple ? (
					<div className='relative w-full'>
						<button
							type='button'
							className={twMerge(
								'hs-dropdown-toggle relative z-10 w-full cursor-pointer rounded-md border border-gray-200 bg-white pr-14 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/25',
								validationErrorText && 'border-red-400 ring-4 ring-red-200'
							)}
						>
							<div className='box-border flex h-16 w-full items-center gap-x-1.5 overflow-x-auto pl-4 text-input font-normal text-gray-500'>
								{!chosenOptions?.length && <span className='pl-1'>{placeholder}</span>}
								{chosenOptions?.map(option => {
									const clearThisOption = () => {
										onChange(chosenIds.filter(optionId => optionId !== option?.id))
									}

									return (
										<button
											onClick={clearThisOption}
											key={option?.id}
											type='button'
											className='flex h-7 items-center gap-[5px] rounded-full border border-gray-200 px-1.5'
										>
											<span className='h-4 whitespace-nowrap text-xs'>{option?.renderNode || option?.value}</span>
											<span className='inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-gray-500'>
												<CrossIcon />
											</span>
										</button>
									)
								})}
							</div>
						</button>
						<ArrowDownIcon className='hs-dropdown-open:rotate-180 absolute right-6 bottom-6 z-10 cursor-pointer transition' />
					</div>
				) : (
					<div className='relative w-full'>
						<input
							readOnly
							value={chosenSingleValue ?? ''}
							placeholder={placeholder}
							type='text'
							className={twMerge(
								'hs-dropdown-toggle relative z-10 box-border h-16 w-full cursor-pointer rounded-md border border-gray-200 bg-white pl-5 pr-14 text-input font-normal placeholder:text-[#B3B3B3] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/25',
								validationErrorText && 'border-red-400 ring-4 ring-red-200'
							)}
						/>
						<ArrowDownIcon className='hs-dropdown-open:rotate-180 absolute right-6 bottom-6 z-10 cursor-pointer transition' />
					</div>
				)}
				{validationErrorText && (
					<span className='mt-[10px] inline-block text-xs leading-none text-red-400'>{validationErrorText}</span>
				)}
				<div
					className='hs-dropdown-menu duration dropdown__menu-strict-bottom hs-dropdown-open:opacity-100 z-20 mt-2 box-border hidden max-h-[50vh] w-full min-w-[15rem] overflow-y-auto rounded-lg bg-white p-2 opacity-0 shadow-md transition-[opacity,margin]'
					aria-labelledby='hs-dropdown-basic'
					data-popper-placement='bottom-start'
				>
					{withSearch && (
						<div className='w-full pb-2'>
							<Input isSearch value={searchValue} onChange={searchVal => setSearchValue(searchVal)} />
						</div>
					)}
					<div className='flex w-full flex-wrap'>
						{visibleOptions.map(menuOption => {
							const isChosenOption = multiple ? chosenIds.includes(menuOption.id) : menuOption.id === chosenId
							const onOptionClick = () => {
								if (multiple) {
									const hasChosen = chosenIds.some(optionId => optionId === menuOption.id)

									if (hasChosen) {
										onChange(chosenIds.filter(optionId => optionId !== menuOption.id))
									} else {
										onChange([...chosenIds, menuOption.id])
									}
								} else {
									onChange(menuOption.id)
								}
							}

							return (
								<button
									className={twMerge(
										'relative flex h-9 w-full items-center rounded px-3 text-left hover:bg-gray-100',
										isChosenOption && 'bg-gray-100'
									)}
									type='button'
									key={menuOption.id}
									onClick={onOptionClick}
								>
									<span
										className={twMerge(
											'hs-dropdown-open inline-flex h-4 w-4 items-center justify-center border',
											multiple ? 'rounded' : 'rounded-full',
											isChosenOption && 'border-0 bg-blue-500'
										)}
									>
										{multiple ? (
											<CheckMarkIcon />
										) : (
											<span className='inline-block h-[7px] w-[7px] rounded-full bg-white' />
										)}
									</span>

									<span className='pl-3 text-sm'>{menuOption.value}</span>
								</button>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
})
