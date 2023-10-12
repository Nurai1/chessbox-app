import { FC, useState, useEffect } from 'react'
import { addZero } from 'src/helpers/addZero'
import { useTimer } from 'src/hooks/useTimer'

type BreakTimerPropsType = {
	minutes: number
	isTimeOver: (isOver: boolean) => void
}

export const BreakTimer: FC<BreakTimerPropsType> = ({ minutes, isTimeOver }) => {
	const time = useTimer({ minutes, isTimeOver })

	return (
		<div className='flex w-[14rem] justify-center rounded-2xl border-2 p-4 text-heading-2'>
			<span className='min-w-[3.125rem]'>{addZero(time.minutes.toString())}</span>
			<span>:</span>
			<span className='min-w-[3.125rem]'>{addZero(time.seconds.toString())}</span>
		</div>
	)
}
