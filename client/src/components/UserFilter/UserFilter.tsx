import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { Checkbox, Input } from 'src/ui'

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

export const UserFilter: FC<UserFilterPropsType> = ({ onChange, inputValues, classes }) => {
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
				/>
				<Input
					onChange={onChange}
					value={inputValues?.weightTo?.toString()}
					classes='h-[48px]'
					placeholder='Max'
					name='weightTo'
					type='number'
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
				/>
				<Input
					onChange={onChange}
					value={inputValues?.ageTo?.toString()}
					classes='h-[48px]'
					placeholder='Max'
					name='ageTo'
					type='number'
				/>
			</div>
		</div>
	)
}
