import { FC, useState, useEffect, memo } from 'react'
import { calcTime, getEndTime } from '../../helpers/datetime'
import { addZero } from '../../helpers/addZero'

type TimerPropsType = {
	time: string
}
const Timer: FC<TimerPropsType> = memo(({ time }) => {
	const [endTime, setEndTime] = useState<{
		minutes: number
		hours: number
		days: number
	}>({
		minutes: 0,
		hours: 0,
		days: 0
	})

	useEffect(() => {
		const currentParsedTime = getEndTime(time)
		setEndTime(currentParsedTime)

		const timer = setInterval(() => {
			setEndTime(t => calcTime(t))
		}, 60000)
		return () => clearInterval(timer)
		// eslint-disable-next-line
	}, [time])

	return (
		<ul className='inline-flex gap-3'>
			<li className='h-[75px] w-[75px] rounded-2xl border-2 border-[#DADADA] py-2 px-1 text-center'>
				<p className='text-2xl font-semibold'>{endTime ? addZero(endTime.days.toString()) : '0'}</p>
				<span className='text-sm font-normal capitalize text-[#6C6A6C]'>{endTime?.days === 1 ? 'day' : 'days'}</span>
			</li>
			<li className='h-[75px] w-[75px] rounded-2xl border-2 border-[#DADADA] py-2 px-1 text-center'>
				<p className='text-2xl font-semibold'>{endTime ? addZero(endTime.hours.toString()) : 0}</p>
				<span className='text-sm font-normal capitalize text-[#6C6A6C]'>{endTime?.hours === 1 ? 'hour' : 'hours'}</span>
			</li>
			<li className='h-[75px] w-[75px] rounded-2xl border-2 border-[#DADADA] py-2 px-1 text-center'>
				<p className='text-2xl font-semibold'>{endTime ? addZero(endTime.minutes.toString()) : 0}</p>
				<span className='text-sm font-normal capitalize text-[#6C6A6C]'>
					{endTime?.minutes === 1 ? 'minute' : 'minutes'}
				</span>
			</li>
		</ul>
	)
})

Timer.displayName = 'Timer'

export { Timer }
