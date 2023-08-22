import { FC, useState, useEffect, memo } from 'react'
import { twMerge } from 'tailwind-merge'
import { calcTime, getEndTime } from '../../helpers/datetime'
import { addZero } from '../../helpers/addZero'

type TimerPropsType = {
	time: string
	classes?: string
	containerClasses?: string
	countNumbersClasses?: string
}
const Timer: FC<TimerPropsType> = memo(({ time, classes, containerClasses, countNumbersClasses }) => {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [time])

	return (
		<ul className={twMerge('inline-flex gap-2 ', classes)}>
			<li
				className={twMerge(
					'text-base font-bold lg:flex lg:h-[55px] lg:w-[55px] lg:flex-col lg:justify-center lg:rounded-2xl lg:border-2 lg:border-[#DADADA] lg:py-2 lg:px-0.5 lg:text-center xl:h-[75px] xl:w-[75px] xl:py-2 xl:px-1',
					containerClasses
				)}
			>
				<span
					className={twMerge(
						'inline font-bold lg:text-sm lg:font-normal xl:block xl:text-2xl xl:font-semibold',
						countNumbersClasses
					)}
				>
					{endTime ? addZero(endTime.days.toString()) : '0'}
				</span>
				<span className='text-base font-bold lg:hidden'>&nbsp;d</span>
				<span
					className='hidden
				lg:block lg:text-xs lg:font-normal lg:capitalize lg:text-grey xl:text-sm'
				>
					{endTime?.days === 1 ? 'day' : 'days'}
				</span>
			</li>
			<li
				className={twMerge(
					'text-base font-bold lg:flex lg:h-[55px] lg:w-[55px] lg:flex-col lg:justify-center lg:rounded-2xl lg:border-2 lg:border-[#DADADA] lg:py-2 lg:px-0.5 lg:text-center xl:h-[75px] xl:w-[75px] xl:py-2 xl:px-1',
					containerClasses
				)}
			>
				<span
					className={twMerge(
						'inline font-bold lg:text-sm lg:font-normal xl:block xl:text-2xl xl:font-semibold',
						countNumbersClasses
					)}
				>
					{endTime ? addZero(endTime.hours.toString()) : 0}
				</span>
				<span className='text-base font-bold lg:hidden'>h</span>
				<span
					className='hidden
				lg:block lg:text-xs lg:font-normal lg:capitalize lg:text-grey xl:text-sm'
				>
					{endTime?.hours === 1 ? 'hour' : 'hours'}
				</span>
			</li>
			<li
				className={twMerge(
					'text-base font-bold lg:flex lg:h-[55px] lg:w-[55px] lg:flex-col lg:justify-center lg:rounded-2xl lg:border-2 lg:border-[#DADADA] lg:py-2 lg:px-0.5 lg:text-center xl:h-[75px] xl:w-[75px] xl:py-2 xl:px-1',
					containerClasses
				)}
			>
				<span
					className={twMerge(
						'inline font-bold lg:text-sm lg:font-normal xl:block xl:text-2xl xl:font-semibold',
						countNumbersClasses
					)}
				>
					{endTime ? addZero(endTime.minutes.toString()) : 0}
				</span>
				<span className='text-base font-bold lg:hidden'>m</span>
				<span
					className='hidden
				lg:block lg:text-xs lg:font-normal lg:capitalize lg:text-grey xl:text-sm'
				>
					{endTime?.minutes === 1 ? 'minute' : 'minutes'}
				</span>
			</li>
		</ul>
	)
})

Timer.displayName = 'Timer'

export { Timer }
