import { FC, useState, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { Checkbox, Input } from 'src/ui'
import { useAppDispatch } from 'src/hooks/redux'
import { setFilterValidationError } from 'src/store/slices/usersSlice'

export type UserFilterType = {
	ageFrom?: number
	ageTo?: number
	weightFrom?: number
	weightTo?: number
	withWomen?: boolean
	withMen?: boolean
}

type UserFilterPropsType = {
	onChange: (value?: string | boolean, name?: string) => void
	inputValues: UserFilterType
	classes?: string
}

type ValidationErrors = {
	weightFrom: string | null
	weightTo: string | null
	ageFrom: string | null
	ageTo: string | null
}

export const UserFilter: FC<UserFilterPropsType> = ({ onChange, inputValues, classes }) => {
	const [errors, setErrors] = useState<ValidationErrors>({
		weightFrom: null,
		weightTo: null,
		ageFrom: null,
		ageTo: null
	})

	const dispatch = useAppDispatch()

	const filterValidation = (key1: keyof typeof errors, key2: keyof typeof errors, value: number) => {
		if (Number(inputValues[key1]) < value) {
			setErrors({ ...errors, [key1]: null })
		}

		if (Number(inputValues[key2]) < value) {
			setErrors({ ...errors, [key2]: null })
		}

		if (inputValues[key2] && Number(inputValues[key1]) < Number(inputValues[key2])) {
			setErrors({ ...errors, [key2]: null })
		}

		if (Number(inputValues[key1]) > value) {
			return setErrors({ ...errors, [key1]: `${value} max value` })
		}

		if (Number(inputValues[key2]) > value) {
			return setErrors({ ...errors, [key2]: `${value} max value` })
		}

		if (inputValues[key2] && Number(inputValues[key1]) > Number(inputValues[key2])) {
			return setErrors({ ...errors, [key2]: 'cannot be less than min value' })
		}

		return null
	}

	useEffect(() => {
		filterValidation('weightFrom', 'weightTo', 199)
		filterValidation('ageFrom', 'ageTo', 99)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputValues])

	useEffect(() => {
		const hasValidationError = Object.values(errors)
			.map(item => item && item?.length > 0)
			.includes(true)

		dispatch(setFilterValidationError(hasValidationError))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [errors])

	return (
		<div className={twMerge('flex flex-col gap-[20px]', classes)}>
			<div className='flex gap-[10px] pb-[10px]'>
				<h3 className='min-w-[61px] text-sm font-bold'>Sex:</h3>
				<Checkbox onChange={onChange} checked={inputValues.withMen} title='Man' name='withMen' classes='mr-[10px]' />
				<Checkbox onChange={onChange} checked={inputValues.withWomen} title='Woman' name='withWomen' />
			</div>
			<div className='flex items-center gap-[10px]'>
				<h3 className='min-w-[61px] text-sm font-bold'>Weight:</h3>
				<Input
					onChange={onChange}
					value={inputValues?.weightFrom?.toString()}
					classes='mr-[7px] h-[48px]'
					placeholder='Min'
					name='weightFrom'
					type='number'
					validationErrorText={errors.weightFrom}
				/>
				<Input
					onChange={onChange}
					value={inputValues?.weightTo?.toString()}
					classes='h-[48px]'
					placeholder='Max'
					name='weightTo'
					type='number'
					validationErrorText={errors.weightTo}
				/>
			</div>
			<div className='flex items-center gap-[10px]'>
				<h3 className='min-w-[61px] text-sm font-bold'>Age:</h3>
				<Input
					onChange={onChange}
					value={inputValues?.ageFrom?.toString()}
					classes='mr-[7px] h-[48px]'
					placeholder='Min'
					name='ageFrom'
					type='number'
					validationErrorText={errors.ageFrom}
				/>
				<Input
					onChange={onChange}
					value={inputValues?.ageTo?.toString()}
					classes='h-[48px]'
					placeholder='Max'
					name='ageTo'
					type='number'
					validationErrorText={errors.ageTo}
				/>
			</div>
		</div>
	)
}
