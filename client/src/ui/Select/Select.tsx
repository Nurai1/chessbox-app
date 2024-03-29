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
	onChange: (value: string, name?: string) => void
	menuOptions: { value: string; id: string }[]
}

export type GeneralSelectProps = {
	label?: string
	// isRequired?: boolean
	placeholder?: string
	dropdownPlaceholder?: string
	withSearch?: boolean
	validationErrorText?: string
	selectClasses?: string
	disabled?: boolean
	name?: string
}

export type SelectPropsType = GeneralSelectProps & (MultipleSelectProps | SingleSelectProps)

export const Select: FC<SelectPropsType> = memo(function Select({
	label,
	onChange,
	placeholder,
	// isRequired,
	chosenId,
	chosenIds,
	multiple,
	menuOptions,
	withSearch,
	validationErrorText,
	selectClasses,
	disabled,
	name,
	dropdownPlaceholder
}) {
	const [isOpen, setIsOpen] = useState(false)
	const [searchValue, setSearchValue] = useState<string>()
	const visibleOptions = withSearch
		? menuOptions.filter(mOption => !searchValue || mOption.value.toLowerCase().includes(searchValue.toLowerCase()))
		: menuOptions

	const chosenSingleValue = getOptionById(menuOptions, chosenId)?.value
	const chosenOptions = chosenIds?.map(mId => getOptionById(menuOptions, mId))

	return (
		<div className='flex w-full flex-wrap font-normal leading-none'>
			<Label label={label} />
			<div className='relative w-full text-sm'>
				{multiple ? (
					<button
						type='button'
						disabled={disabled}
						className={twMerge(
							'relative w-full rounded-md border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/25',
							validationErrorText && 'border-red-400 ring-4 ring-red-200'
						)}
						onClick={() => {
							setIsOpen(!isOpen)
						}}
					>
						<div className={twMerge('relative z-10 w-full cursor-pointer rounded-md bg-white pr-14', selectClasses)}>
							<div className='box-border flex h-16 w-full items-center gap-x-1.5 overflow-x-auto pl-4 font-medium text-gray-500'>
								{!chosenOptions?.length && <span className='pl-1 text-input'>{placeholder}</span>}
								{chosenOptions?.map(option => {
									const clearThisOption = () => {
										onChange(chosenIds.filter(optionId => optionId !== option?.id))
									}

									return (
										<button
											onClick={clearThisOption}
											key={option?.id}
											type='button'
											className='flex h-7 items-center gap-[5px] rounded-full border border-gray-200 px-1.5 text-xs'
										>
											<span className='h-4 whitespace-nowrap'>{option?.renderNode || option?.value}</span>
											<span className='inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-gray-500'>
												<CrossIcon />
											</span>
										</button>
									)
								})}
							</div>
						</div>
						<ArrowDownIcon
							className={twMerge('absolute bottom-6 right-6 z-10 cursor-pointer transition', isOpen && 'rotate-180')}
						/>
					</button>
				) : (
					<button
						type='button'
						className='relative w-full'
						disabled={disabled}
						onClick={() => {
							setIsOpen(!isOpen)
						}}
					>
						<input
							readOnly
							value={chosenSingleValue ?? ''}
							placeholder={placeholder}
							type='text'
							name={name}
							className={twMerge(
								'relative z-10 box-border h-9 w-full cursor-pointer rounded-md border border-gray-200 bg-white pl-5 pr-14 text-input font-normal placeholder:text-[#B3B3B3] focus:border focus:border-black focus:ring-0 xl:h-12',
								validationErrorText && 'border-red-400 ring-4 ring-red-200',
								selectClasses,
								disabled && 'text-gray-400'
							)}
						/>
						<ArrowDownIcon
							className={twMerge(
								'absolute bottom-1/2 right-6 z-10 translate-y-1/2 cursor-pointer transition',
								isOpen && 'rotate-180'
							)}
						/>
					</button>
				)}
				{validationErrorText && (
					<span className='absolute bottom-[-18px] left-0 text-xs leading-none text-red-400'>
						{validationErrorText}
					</span>
				)}
				<div
					className={twMerge(
						'absolute right-0 z-[-10] mt-0 box-border max-h-[50vh] min-w-full overflow-y-auto rounded-lg bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] duration-300',
						isOpen && 'z-20 mt-2 opacity-100'
					)}
				>
					{withSearch && (
						<div className='w-full pb-2'>
							<Input isSearch value={searchValue} onChange={searchVal => setSearchValue(searchVal)} />
						</div>
					)}
					<div className='flex flex-col'>
						{dropdownPlaceholder && (
							<span className='flex min-h-[3rem] items-center pl-3 font-bold [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-300'>
								{dropdownPlaceholder}
							</span>
						)}
						{visibleOptions.map(menuOption => {
							const isChosenOption = multiple ? chosenIds.includes(menuOption.id) : menuOption.id === chosenId
							const onOptionClick = (fieldName?: string) => {
								if (multiple) {
									const hasChosen = chosenIds.some(optionId => optionId === menuOption.id)

									if (hasChosen) {
										onChange(chosenIds.filter(optionId => optionId !== menuOption.id))
									} else {
										onChange([...chosenIds, menuOption.id])
									}
								} else {
									onChange(menuOption.id, fieldName)
									setIsOpen(false)
								}
							}

							return (
								<button
									className={twMerge(
										'relative flex min-h-[3rem] items-center text-left hover:bg-gray-100 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-300'
										// isChosenOption && 'bg-gray-100'
									)}
									type='button'
									key={menuOption.id}
									onClick={() => onOptionClick(name)}
								>
									{multiple && (
										<span
											className={twMerge(
												'inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full border',
												isChosenOption && 'border-0 bg-blue-500'
											)}
										>
											<CheckMarkIcon />
										</span>
									)}
									<span className='whitespace-nowrap pl-3 text-sm'>{menuOption.value}</span>
								</button>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
})
