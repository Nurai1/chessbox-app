import { FC, useEffect, useState } from 'react'
import { CheckboxAndRadioButton, Input } from 'src/ui'
import { twMerge } from 'tailwind-merge'
import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'

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
	setValidationError: (name: boolean) => void
	classes?: string
}

type ValidationErrors = {
	weightFrom: string | null
	weightTo: string | null
	ageFrom: string | null
	ageTo: string | null
}

export const UserFilter: FC<UserFilterPropsType> = ({ onChange, inputValues, setValidationError, classes }) => {
	const { t } = useOptionalTranslation()
	const [errors, setErrors] = useState<ValidationErrors>({
		weightFrom: null,
		weightTo: null,
		ageFrom: null,
		ageTo: null
	})

	const filterValidation = (key1: keyof typeof errors, key2: keyof typeof errors, value: number) => {
		if (Number(inputValues[key1]) < value) {
			setValidationError(false)
			setErrors({ ...errors, [key1]: null })
		}

		if (Number(inputValues[key2]) < value) {
			setValidationError(false)
			setErrors({ ...errors, [key2]: null })
		}

		if (inputValues[key2] && Number(inputValues[key1]) < Number(inputValues[key2])) {
			setValidationError(false)
			setErrors({ ...errors, [key2]: null })
		}

		if (Number(inputValues[key1]) > value) {
			setValidationError(true)
			setErrors({ ...errors, [key1]: `${value} ${t('minValue')}` })
		}

		if (Number(inputValues[key2]) > value) {
			setValidationError(true)
			setErrors({ ...errors, [key2]: `${value} ${t('maxValue')}` })
		}

		if (inputValues[key2] && Number(inputValues[key1]) > Number(inputValues[key2])) {
			setValidationError(true)
			setErrors({ ...errors, [key2]: t('lessMinValue') })
		}

		return null
	}

	useEffect(() => {
		filterValidation('weightFrom', 'weightTo', 199)
		filterValidation('ageFrom', 'ageTo', 99)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputValues])

	return (
		<div className={twMerge('flex flex-col gap-[20px]', classes)}>
			<div className='flex gap-[10px] pb-[10px]'>
				<h3 className='min-w-[61px] text-sm font-bold'>{t('sex')}:</h3>
				<CheckboxAndRadioButton
					onChange={onChange}
					type='checkbox'
					checked={inputValues.withMen}
					title={t('man')}
					name='withMen'
					classes='mr-[10px]'
				/>
				<CheckboxAndRadioButton
					onChange={onChange}
					type='checkbox'
					checked={inputValues.withWomen}
					title={t('woman')}
					name='withWomen'
				/>
			</div>
			<div className='flex items-center gap-[10px]'>
				<h3 className='min-w-[61px] text-sm font-bold'>{t('weight')}:</h3>
				<Input
					onChange={onChange}
					value={inputValues?.weightFrom?.toString()}
					classes='mr-[7px] h-[48px]'
					placeholder={t('min')}
					name='weightFrom'
					type='number'
					validationErrorText={errors.weightFrom}
				/>
				<Input
					onChange={onChange}
					value={inputValues?.weightTo?.toString()}
					classes='h-[48px]'
					placeholder={t('max')}
					name='weightTo'
					type='number'
					validationErrorText={errors.weightTo}
				/>
			</div>
			<div className='flex items-center gap-[10px]'>
				<h3 className='min-w-[61px] text-sm font-bold'>{t('age')}:</h3>
				<Input
					onChange={onChange}
					value={inputValues?.ageFrom?.toString()}
					classes='mr-[7px] h-[48px]'
					placeholder={t('min')}
					name='ageFrom'
					type='number'
					validationErrorText={errors.ageFrom}
				/>
				<Input
					onChange={onChange}
					value={inputValues?.ageTo?.toString()}
					classes='h-[48px]'
					placeholder={t('max')}
					name='ageTo'
					type='number'
					validationErrorText={errors.ageTo}
				/>
			</div>
		</div>
	)
}
