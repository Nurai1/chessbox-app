import { FC, useState, useEffect, memo } from 'react'
import { twMerge } from 'tailwind-merge'
import { calcTime, getEndTime, getEndTimeBySeconds, isPast } from '../../helpers/datetime'
import { addZero } from '../../helpers/addZero'

type TimerPropsType = (
	| {
			time?: never
			secondsLeft: number
	  }
	| {
			time: string
			secondsLeft?: never
	  }
) & {
	classes?: string
	containerClasses?: string
	countNumbersClasses?: string
	countLabelsClasses?: string
	showDays?: boolean
	handleTimeOver?: () => void
}
const Timer: FC<TimerPropsType> = memo(
	({ time, secondsLeft, classes, containerClasses, countNumbersClasses, countLabelsClasses, showDays = true, handleTimeOver }) => {
		const [endTime, setEndTime] = useState<{
			seconds: number
			minutes: number
			hours: number
			days: number
		}>({
			seconds: 0,
			minutes: 0,
			hours: 0,
			days: 0
		})

		useEffect(() => {
			if (time && isPast(time)) {
				return
			}

			const currentParsedTime = time ? getEndTime(time) : getEndTimeBySeconds(secondsLeft as number)

			setEndTime(currentParsedTime)

			const timer = setInterval(
				() => {
					if (time && isPast(time)) {
						if (handleTimeOver) {
							handleTimeOver()
						}

						clearInterval(timer)
						return
					}
					setEndTime(t => calcTime({ time: t, perMinute: showDays }))
				},
				showDays ? 60000 : 1000
			)
			return () => clearInterval(timer)
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [time])

		return (
			<ul className={twMerge('inline-flex gap-2', classes)}>
				{showDays && (
					<li
						className={twMerge(
							'flex h-[55px] w-[55px] flex-col justify-center rounded-2xl border-2 border-[#DADADA] py-2 px-0.5 text-center text-base font-bold xl:h-[75px] xl:w-[75px] xl:py-2 xl:px-1',
							containerClasses
						)}
					>
						<span
							className={twMerge(
								'inline font-bold md:text-sm xl:block xl:text-2xl xl:font-semibold',
								countNumbersClasses
							)}
						>
							{endTime ? addZero(endTime.days.toString()) : '0'}
						</span>
						<span className={twMerge('block text-xs font-normal xl:text-sm xl:mt-2', countLabelsClasses)}>
							{endTime?.days === 1 ? 'day' : 'days'}
						</span>
					</li>
				)}
				<li
					className={twMerge(
						'flex h-[55px] w-[55px] flex-col justify-center rounded-2xl border-2 border-[#DADADA] py-2 px-0.5 text-center text-base font-bold xl:h-[75px] xl:w-[75px] xl:py-2 xl:px-1',
						containerClasses
					)}
				>
					<span
						className={twMerge(
							'inline font-bold lg:text-sm xl:block xl:text-2xl xl:font-semibold',
							countNumbersClasses
						)}
					>
						{endTime ? addZero(endTime.hours.toString()) : 0}
					</span>
					<span className={twMerge('block text-xs font-normal xl:text-sm xl:mt-2', countLabelsClasses)}>
						{endTime?.hours === 1 ? 'hour' : 'hours'}
					</span>
				</li>
				<li
					className={twMerge(
						'flex h-[55px] w-[55px] flex-col justify-center rounded-2xl border-2 border-[#DADADA] py-2 px-0.5 text-center text-base font-bold xl:h-[75px] xl:w-[75px] xl:py-2 xl:px-1',
						containerClasses
					)}
				>
					<span
						className={twMerge(
							'inline font-bold lg:text-sm xl:block xl:text-2xl xl:font-semibold',
							countNumbersClasses
						)}
					>
						{endTime ? addZero(endTime.minutes.toString()) : 0}
					</span>
					<span className={twMerge('block text-xs font-normal xl:text-sm xl:mt-2', countLabelsClasses)}>
						{endTime?.minutes === 1 ? 'minute' : 'minutes'}
					</span>
				</li>
				{!showDays && (
					<li
						className={twMerge(
							'flex h-[55px] w-[55px] flex-col justify-center rounded-2xl border-2 border-[#DADADA] py-2 px-0.5 text-center text-base font-bold xl:h-[75px] xl:w-[75px] xl:py-2 xl:px-1',
							containerClasses
						)}
					>
						<span
							className={twMerge(
								'inline font-bold lg:text-sm xl:block xl:text-2xl xl:font-semibold',
								countNumbersClasses
							)}
						>
							{endTime ? addZero(endTime.seconds.toString()) : '0'}
						</span>
						<span className={twMerge('block text-xs font-normal xl:text-sm xl:mt-2', countLabelsClasses)}>
							{endTime?.seconds === 1 ? 'second' : 'seconds'}
						</span>
					</li>
				)}
			</ul>
		)
	}
)

Timer.displayName = 'Timer'

export { Timer }
