import { useEffect, useState } from 'react'

type UseTimerPropsType = {
	minutes: number
	seconds?: number
	onTimeOver?: (isOver: boolean) => void
}

export const useTimer = ({ minutes, seconds = 0, onTimeOver }: UseTimerPropsType) => {
	const [time, setTime] = useState({
		minutes,
		seconds
	})

	useEffect(() => {
		const timer = setInterval(() => {
			if (time.seconds === 0 && time.minutes === 0) {
				clearInterval(timer)

				if (onTimeOver) {
					onTimeOver(true)
				}
			} else {
				setTime(state => ({
					minutes: state.seconds === 0 ? state.minutes - 1 : state.minutes,
					seconds: state.seconds === 0 ? 59 : state.seconds - 1
				}))
			}
		}, 1000)

		return () => clearInterval(timer)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [time])

	return time
}
