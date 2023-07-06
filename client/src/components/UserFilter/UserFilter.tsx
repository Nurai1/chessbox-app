import { ChangeEvent, FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { Checkbox, Input } from 'src/ui'

type UserFilterPropsType = {
	onChange: (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void
	inputValues: Record<string, string>
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
							<Checkbox title='Man' name='man' classes='mr-[10px]' />
							<Checkbox title='Woman' name='Woman' />
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
						/>
						<Input onChange={onChange} value={inputValues.ageTo} classes='h-[48px]' placeholder='Max' name='ageTo' />
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
						/>
						<Input
							onChange={onChange}
							value={inputValues.weightTo}
							classes='h-[48px]'
							placeholder='Max'
							name='weightTo'
						/>
					</td>
				</tr>
			</tbody>
		</table>
	)
}
