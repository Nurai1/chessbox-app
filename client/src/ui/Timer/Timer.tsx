import { FC, useState, useEffect } from 'react'
import { getEndTime } from '../../helpers/datetime'

type TimerPropsType = {
	time: string
}
export const Timer: FC<TimerPropsType> = ({ time }) => {
	const [endTime, setEndTime] = useState({ time: getEndTime(time) })

	useEffect(() => {
		const timer = setInterval(() => setEndTime({ time: getEndTime(time) }), 60000)
		return () => clearInterval(timer)
	})

	return (
		<ul className='inline-flex gap-3'>
			{endTime.time.map(({ title, value }) => (
				<li className='h-[75px] w-[75px] rounded-2xl border-2 border-[#DADADA] py-2 px-1 text-center' key={title}>
					<p className='text-2xl font-semibold'>{value}</p>
					<span className='text-sm font-normal capitalize text-[#6C6A6C]'>{title}</span>
				</li>
			))}
		</ul>
	)
}
