import { FC, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { CheckboxAndRadioButton, Input, Button } from 'src/ui'
import { CompetitionRequirementsSchema } from 'src/types'

type GroupParametersPropsType = {
	requirements: CompetitionRequirementsSchema
	classes?: string
}

type Errors = {
	weightMessage?: string
	ageMessage?: string
	weightFrom?: string
	weightTo?: string
	ageFrom?: string
	ageTo?: string
}

type GroupParametersForm = Omit<Errors, 'weightMessage' | 'ageMessage'> & {
	sex?: string
} & Errors

export const GroupParameters: FC<GroupParametersPropsType> = ({ classes, requirements }) => {
	const [groupData, setGroupData] = useState<GroupParametersForm>({
		sex: 'man'
	})
	const [errors, setErrors] = useState<Errors>({})

	const validate = (
		key1: keyof typeof groupData,
		key2: keyof typeof groupData,
		errorTitle: keyof typeof errors,
		fieldName: string,
		minValue: number,
		maxValue: number
	) => {
		if (groupData[key1] && groupData[key2]) {
			setErrors({ ...errors, [errorTitle]: '' })
		}

		if (!groupData[key1] || !groupData[key2]) {
			setErrors({ ...errors, [errorTitle]: 'Both fields must be filled' })
			return
		}

		if (Number(groupData[key2]) < Number(groupData[key1])) {
			setErrors({ ...errors, [errorTitle]: 'Min value bigger than max value' })
			return
		}

		if (Number(groupData[key1]) < minValue) {
			setErrors({
				...errors,
				[key1]: `${groupData.sex} < ${groupData[key1]}`,
				[errorTitle]: `${fieldName} is out of requirements`
			})
			return
		}

		if (Number(groupData[key2]) > maxValue) {
			setErrors({
				...errors,
				[key2]: `${groupData.sex} < ${groupData[key2]}`,
				[errorTitle]: `${fieldName} is out of requirements`
			})
		}
	}

	const onChange = (value?: string | boolean, name?: string) => {
		setGroupData({
			...groupData,
			[name as string]: value as string
		})
	}

	return (
		<div className={twMerge('max-w-[16rem]', classes)}>
			<div className='mb-2.5 flex h-12 items-center'>
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
			<div className='flex'>
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
			</div>
			{errors.weightMessage && <span className='ml-[4.375rem] text-xs text-red'>{errors.weightMessage}</span>}
			<div className='mt-2.5 flex'>
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
			</div>
			{errors.ageMessage && <span className='ml-[4.375rem] text-xs text-red'>{errors.ageMessage}</span>}
			<Button
				onClick={() => {
					if (requirements) {
						validate(
							'ageFrom',
							'ageTo',
							'ageMessage',
							'Age',
							requirements.ageCategory?.from as number,
							requirements.ageCategory?.to as number
						)
						validate(
							'weightFrom',
							'weightTo',
							'weightMessage',
							'Weight',
							requirements.weightCategory?.from as number,
							requirements.weightCategory?.to as number
						)
					}
				}}
				classes='w-full mb-2 mt-4'
			>
				Add group
			</Button>
			{/* <span className='text-red'>Group parameters overlap with group </span> */}
			<Button onClick={() => ''} type='outlined' classes='w-full mb-2'>
				Show
			</Button>
			<Button onClick={() => ''} type='outlined' classes='w-full'>
				Clean up
			</Button>
		</div>
	)
}
