import { useEffect, useState } from 'react'

type useTimerPropsType = {
    minutes: number
    seconds?: number
    isTimeOver?: (isOver: boolean) => void
}

export const useTimer = ({minutes, seconds = 0, isTimeOver}: useTimerPropsType) => {
    const [time, setTime] = useState({
        minutes,
        seconds
    })
    
    useEffect(() => {
        const timer = setInterval(() => {
            if (time.seconds === 0 && time.minutes === 0) {
                clearInterval(timer)
                
                if (isTimeOver) {
                    isTimeOver(true)
                }
            } else {
                setTime((state) => ({
                    minutes: state.seconds === 0 ? state.minutes - 1 : state.minutes,
                    seconds: state.seconds === 0 ? 59 : state.seconds - 1
                }))
            }
        }, 1000)
        
        return () => clearInterval(timer)
    }, [time])

    return time
}

