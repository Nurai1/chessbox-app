import { FC, useState, useEffect, memo } from 'react'
import { twMerge } from 'tailwind-merge'
import { calcTime, getEndTime, isPast } from '../../helpers/datetime'
import { addZero } from '../../helpers/addZero'

type TimerPropsType = {
	time: string
	classes?: string
	containerClasses?: string
	countNumbersClasses?: string
	handleTimeOver?: (isTimerFinished: boolean) => void
}
const Timer: FC<TimerPropsType> = memo(({ time, classes, containerClasses, countNumbersClasses, handleTimeOver }) => {
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
		if (!isPast(time)) {
			setEndTime(getEndTime(time))
		}

		const timer = setInterval(() => {
			if (isPast(time)) {
				if (handleTimeOver) {
					handleTimeOver(true)
				}
				clearInterval(timer)

				return
			}
			setEndTime(t => calcTime(t))
		}, 60000)
		// eslint-disable-next-line consistent-return
		return () => clearInterval(timer)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [time])

	return (
		<ul className={twMerge('inline-flex gap-3', classes)}>
			<li
				className={twMerge(
					'p-1 w-14 h-14 rounded-2xl border-2 border-pale-grey flex flex-col text-center md:w-[4.25rem] xl:w-[5.75rem] xl:h-[4.75rem] xl:p-2 2xl:w-[4.75rem]',
					containerClasses
				)}
			>
				<span
					className={twMerge(
						'font-bold xl:text-2xl xl:font-semibold',
						countNumbersClasses
					)}
				>
					{endTime ? addZero(endTime.days.toString()) : '0'}
				</span>
				<span
					className='text-xs text-grey xl:text-sm'
				>
					{endTime?.days === 1 ? 'Day' : 'Days'}
				</span>
			</li>
			<li
				className={twMerge(
					'p-1 w-14 h-14 rounded-2xl border-2 border-pale-grey flex flex-col text-center md:w-[4.25rem] xl:w-[5.75rem] xl:h-[4.75rem] xl:p-2 2xl:w-[4.75rem]',
					containerClasses
				)}
			>
				<span
					className={twMerge(
						'font-bold xl:text-2xl xl:font-semibold',
						countNumbersClasses
					)}
				>
					{endTime ? addZero(endTime.hours.toString()) : 0}
				</span>
				<span
					className='text-xs text-grey xl:text-sm'
				>
					{endTime?.hours === 1 ? 'Hour' : 'Hours'}
				</span>
			</li>
			<li
				className={twMerge(
					'p-1 w-14 h-14 rounded-2xl border-2 border-pale-grey flex flex-col text-center md:w-[4.25rem] xl:w-[5.75rem] xl:h-[4.75rem] xl:p-2 2xl:w-[4.75rem]',
					containerClasses
				)}
			>
				<span
					className={twMerge(
						'font-bold xl:text-2xl xl:font-semibold',
						countNumbersClasses
					)}
				>
					{endTime ? addZero(endTime.minutes.toString()) : 0}
				</span>
				<span
					className='text-xs text-grey xl:text-sm'
				>
					{endTime?.minutes === 1 ? 'Minute' : 'Minutes'}
				</span>
			</li>
		</ul>
	)
})

Timer.displayName = 'Timer'

export { Timer }
