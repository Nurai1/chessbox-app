import { FC } from 'react'

type TimerPropsType = {
	timerData: {
		title: string
		value: string
	}[]
}
export const Timer: FC<TimerPropsType> = ({ timerData }) => {
	return (
		<ul className='inline-flex gap-3'>
			{timerData.map(({ title, value }) => (
				<li className='h-[75px] w-[75px] rounded-2xl border-2 border-[#DADADA] py-2 px-1 text-center' key={title}>
					<p className='text-2xl font-semibold'>{value}</p>
					<span className='text-sm font-normal capitalize text-[#6C6A6C]'>{title}</span>
				</li>
			))}
		</ul>
	)
}
