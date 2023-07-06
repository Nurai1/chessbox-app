import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { Checkbox, Input } from 'src/ui'

export type UserFilterType = {
	ageFrom: string
	ageTo: string
	weightFrom: string
	weightTo: string
	withWomen: boolean
	withMen: boolean
}

type UserFilterPropsType = {
	onChange: (value?: string | boolean, name?: string) => void
	inputValues: UserFilterType
	classes?: string
}

export const UserFilter: FC<UserFilterPropsType> = ({ onChange, inputValues, classes }) => {
	return (
		<table className={twMerge('w-full border-spacing-[20px]', classes)}>
			<tbody>
				<tr>
					<td className='pb-[30px] pr-[10px]'>
						<h3 className='text-sm font-bold'>Sex:</h3>
					</td>
					<td className='pb-[30px]'>
						<div>
							<Checkbox
								onChange={onChange}
								checked={inputValues.withMen}
								title='Man'
								name='withMen'
								classes='mr-[10px]'
							/>
							<Checkbox onChange={onChange} checked={inputValues.withWomen} title='Woman' name='withWomen' />
						</div>
					</td>
				</tr>
				<tr>
					<td className='pb-[20px] pr-[10px]'>
						<h3 className='text-sm font-bold'>Weight:</h3>
					</td>
					<td className='flex pb-[20px]'>
						<Input
							onChange={onChange}
							value={inputValues.ageFrom}
							classes='mr-[7px] h-[48px]'
							placeholder='Min'
							name='ageFrom'
							type='number'
						/>
						<Input
							onChange={onChange}
							value={inputValues.ageTo}
							classes='h-[48px]'
							placeholder='Max'
							name='ageTo'
							type='number'
						/>
					</td>
				</tr>
				<tr>
					<td className='pr-[10px]'>
						<h3 className='text-sm font-bold'>Age:</h3>
					</td>
					<td className='flex'>
						<Input
							onChange={onChange}
							value={inputValues.weightFrom}
							classes='mr-[7px] h-[48px]'
							placeholder='Min'
							name='weightFrom'
							type='number'
						/>
						<Input
							onChange={onChange}
							value={inputValues.weightTo}
							classes='h-[48px]'
							placeholder='Max'
							name='weightTo'
							type='number'
						/>
					</td>
				</tr>
			</tbody>
		</table>
	)
}
