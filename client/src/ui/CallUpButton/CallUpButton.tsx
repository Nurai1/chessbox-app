import { useState, FC } from 'react'
import { Button } from '../Button'

type CallUpButtonPropsType = {
	onCallPairPreparation: () => void
	breakTime?: boolean
	callPairPreparationPending?: boolean
	disable?: boolean
}

// this component need to incapsulate state
export const CallUpButton: FC<CallUpButtonPropsType> = ({
	onCallPairPreparation,
	breakTime,
	callPairPreparationPending,
	disable
}) => {
	const [isCallpairClicked, setIsCallpairClicked] = useState(false)
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
