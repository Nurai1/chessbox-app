import { useState, FC } from 'react'
import { Button } from 'src/ui/Button'
import { useAppSelector } from 'src/hooks/redux'

type CallUpButtonPropsType = {
	onCallPairPreparation: () => void
	breakTime?: boolean
	disable?: boolean
}

// this component need to incapsulate state
export const CallUpButton: FC<CallUpButtonPropsType> = ({ onCallPairPreparation, breakTime, disable }) => {
	const [isCallpairClicked, setIsCallpairClicked] = useState(false)
	const { callPairPreparationPending } = useAppSelector(s => s.competition)

	return (
		<Button
			onClick={() => {
				onCallPairPreparation()
				setIsCallpairClicked(state => !state)
			}}
			disabled={breakTime || disable}
			loading={callPairPreparationPending && isCallpairClicked}
		>
			Call up
		</Button>
	)
}
