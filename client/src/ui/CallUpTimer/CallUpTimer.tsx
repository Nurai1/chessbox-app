import { FC, useEffect, useState } from 'react'
import { useAppDispatch } from 'src/hooks/redux'
import { addValuecallUpTimerRunningIds, removeValuecallUpTimerRunningIds } from 'src/store/slices/competitionSlice'
import { Button } from '../Button'
import { addZero } from 'src/helpers/addZero'
import { useTimer } from 'src/hooks/useTimer'

type CallUpTimerPropsType = {
    onTimeOver: () => void
    seconds: number 
    minutes?: number
    id?: string
}

export const CallUpTimer: FC<CallUpTimerPropsType> = ({minutes = 0, seconds, onTimeOver, id}) => {
    const [isRuning, setIsRuning] = useState(true)
    const dispatch = useAppDispatch()

    const timer = useTimer({
        minutes,
        seconds,
        onTimeOver
    })

    useEffect(() => {
        if (timer.minutes === 0 && timer.seconds === 0) {
            setIsRuning(false)
        } else {
            setIsRuning(true)
        }
    }, [timer])

    useEffect(() => {
        if (id) {
            if (isRuning) {
                dispatch(addValuecallUpTimerRunningIds(id))
            } else {
                dispatch(removeValuecallUpTimerRunningIds(id))
            }
        }
        return () => {
            if (id) {
                dispatch(removeValuecallUpTimerRunningIds(id))
            }
        }
    }, [isRuning])

    return (
        <Button type='outlined' onClick={() => ''} disabled>
            {addZero(String(timer.minutes))}:{addZero(String(timer.seconds))}
        </Button>
    )
}