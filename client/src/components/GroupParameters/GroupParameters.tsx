import { FC, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { CheckboxAndRadioButton, Input, Button } from 'src/ui'
import { CompetitionRequirementsSchema } from 'src/types'

export type GroupParametersForm = Omit<Errors, 'weightMessage' | 'ageMessage'> & {
	sex: string
} & Errors

type GroupParametersPropsType = {
	requirements: CompetitionRequirementsSchema
	getGroupParameters: (data: CompetitionRequirementsSchema) => void
	addGroup: () => void
	classes?: string
	disableAddGroupBtn?: boolean
	addGroupRequestPending?: boolean
	resetFilterTrigger?: boolean
}

type Errors = {
	weightMessage?: string
	ageMessage?: string
	weightFrom?: string
	weightTo?: string
	ageFrom?: string
	ageTo?: string
}

const GROUP_DATA_FIELDS_NUMBER = 5

export const GroupParameters: FC<GroupParametersPropsType> = ({
	requirements,
	getGroupParameters,
	addGroup,
	disableAddGroupBtn = true,
	classes,
	addGroupRequestPending,
	resetFilterTrigger
}) => {
	const [groupData, setGroupData] = useState<GroupParametersForm>({ sex: 'man' })
	const [errors, setErrors] = useState<Errors>({})

	const validate = (
		key1: keyof typeof groupData,
		key2: keyof typeof groupData,
		errorTitle: keyof typeof errors,
		fieldName: string,
		minValue: number,
		maxValue: number
	) => {
		if (Number(groupData[key1]) >= minValue) {
			setErrors((prevState) => ({
					...prevState,
					[key1]: undefined,
					[errorTitle]: undefined
				}
			))
		}

		if (Number(groupData[key2]) <= maxValue) {
			setErrors((prevState) => ({
				...prevState,
				[key2]: undefined,
				[errorTitle]: undefined
			}))
		}

		if (!groupData[key1] || !groupData[key2]) {
			setErrors((prevSate) => ({ ...prevSate, [errorTitle]: 'Both fields must be filled' }))
			return
		}

		if (Number(groupData[key1]) < minValue || Number(groupData[key1]) > maxValue) {
			setErrors((prevSate) => ({
				...prevSate,
				[key1]: `${groupData.sex} < ${groupData[key1]} ${fieldName === 'Age' ? 'age' : 'kg'}`,
				[errorTitle]: `${fieldName} is out of requirements`
			}))
		}

		if (Number(groupData[key2]) > maxValue || Number(groupData[key2]) < minValue) {
			setErrors((prevSate) => ({
				...prevSate,
				[key2]: `${groupData.sex} > ${groupData[key2]} ${fieldName === 'Age' ? 'age' : 'kg'}`,
				[errorTitle]: `${fieldName} is out of requirements`
			}))
		}

		if (groupData[key2] && groupData[key1] && Number(groupData[key2]) < Number(groupData[key1])) {
			setErrors((prevState) => ({ ...prevState, [errorTitle]: 'Min value bigger than max value' }))
		}
	}

	useEffect(() => {
		if (requirements) {
			validate(
				'ageFrom',
				'ageTo',
				'ageMessage',
				'Age',
				requirements.ageCategory?.from || 10,
				requirements.ageCategory?.to || 99
			)
			validate(
				'weightFrom',
				'weightTo',
				'weightMessage',
				'Weight',
				requirements.weightCategory?.from || 40,
				requirements.weightCategory?.to || 199
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groupData])

	useEffect(() => {
		setGroupData({ sex: 'man' })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resetFilterTrigger])

	const onChange = (value?: string | boolean, name?: string) => {
		setGroupData({
			...groupData,
			[name as string]: value as string
		})
	}

	const hasErrors = () => {
		if (errors.weightTo || errors.weightFrom || errors.ageTo || errors.ageFrom) {
			return true
		}
		return false
	}

	return (
		<div className={twMerge('max-w-[16rem] relative', classes)}>
			<div className='mb-6 flex h-12 items-center'>
				<p className='min-w-[4.375rem] font-bold'>Sex:</p>
				<CheckboxAndRadioButton
					name='sex'
					type='radio'
					onChange={onChange}
					title='Man'
					value='man'
					checked={groupData.sex === 'man'}
					classes='mr-2.5'
				/>
				<CheckboxAndRadioButton
					name='sex'
					type='radio'
					onChange={onChange}
					title='Woman'
					value='woman'
					checked={groupData.sex === 'woman'}
				/>
			</div>
			<div className='flex mb-9 relative'>
				<p className='m-auto min-w-[4.375rem] font-bold'>Weight:</p>
				<Input
					name='weightFrom'
					type='number'
					onChange={onChange}
					placeholder='Min'
					value={groupData.weightFrom}
					classes='mr-2'
				/>
				<Input name='weightTo' type='number' onChange={onChange} placeholder='Max' value={groupData.weightTo} />
				{errors.weightMessage && <span className='absolute left-[4.375rem] -bottom-6 text-xs text-error-red'>{errors.weightMessage}</span>}
			</div>

			<div className='flex mb-9 relative'>
				<p className='m-auto min-w-[4.375rem] font-bold'>Age:</p>
				<Input
					name='ageFrom'
					type='number'
					onChange={onChange}
					value={groupData.ageFrom}
					placeholder='Min'
					classes='mr-2'
				/>
				<Input name='ageTo' type='number' onChange={onChange} value={groupData.ageTo} placeholder='Max' />
				{errors.ageMessage && <span className='absolute left-[4.375rem] -bottom-6 text-xs text-error-red'>{errors.ageMessage}</span>}
			</div>
			<Button
				disabled={disableAddGroupBtn || Object.values(groupData).length !== GROUP_DATA_FIELDS_NUMBER}
				classes='w-full mb-2'
				onClick={addGroup}
				loading={addGroupRequestPending}
			>
				Add group
			</Button>
			<Button
				disabled={!Object.values(errors).every(error => error === undefined)}
				type='outlined'
				classes='w-full mb-2'
				onClick={() => {
					getGroupParameters({
						ageCategory: {
							from: groupData.ageFrom ? Number(groupData.ageFrom) : undefined,
							to: groupData.ageTo ? Number(groupData.ageTo) : undefined
						},
						weightCategory: {
							from: groupData.weightFrom ? Number(groupData.weightFrom) : undefined,
							to: Number(groupData.weightTo)
						},
						gender: groupData.sex
					})
			}}>
				Show
			</Button>
			<Button onClick={() => {
				setGroupData({sex: 'man'})
				setErrors({})
			}} type='outlined' classes='w-full'>
				Clean up
			</Button>
			{hasErrors() && <p className="absolute -bottom-9 text-error-red text-xs">Group parameters overlap with group <br/>
                <span className='font-bold'>{errors.weightFrom} {errors.weightTo} {errors.ageFrom} {errors.ageTo}</span>
            </p>}
		</div>
	)
}
