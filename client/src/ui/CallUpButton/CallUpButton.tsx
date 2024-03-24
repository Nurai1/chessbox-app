import { FC, useState } from 'react'
import { useAppSelector } from 'src/hooks/redux'
import { Button } from 'src/ui/Button'

type CallUpButtonPropsType = {
	onCallPairPreparation: () => void
	breakTime?: boolean
	disable?: boolean
}

// this component need to incapsulate state
export const CallUpButton: FC<CallUpButtonPropsType> = ({ onCallPairPreparation, breakTime, disable }) => {
	const [isCallpairClicked, setIsCallpairClicked] = useState(false)
	const { callPairPreparationPending, defineWinnerPending } = useAppSelector(s => s.competition)

	return (
		<Button
			onClick={() => {
				onCallPairPreparation()
				setIsCallpairClicked(state => !state)
			}}
			disabled={breakTime || disable || callPairPreparationPending || defineWinnerPending}
			loading={callPairPreparationPending && isCallpairClicked}
		>
			Start
		</Button>
	)
}
