import { useState, FC, useEffect } from 'react'
import { Button } from 'src/ui/Button'
import { useAppSelector } from 'src/hooks/redux'

type SetPaymentButtonPropsType = {
	onClick: () => void
	name: string
	type?: 'primary' | 'outlined' | 'ghost'
	classes?: string
}

// this component need to incapsulate state
export const SetPaymentButton: FC<SetPaymentButtonPropsType> = ({ onClick, name, type, classes }) => {
	const [clicked, setClicked] = useState(false)
	const { setUserPaymentPaidPending } = useAppSelector(s => s.competition)

	useEffect(() => {
		return () => {
			if (clicked) {
				setClicked(false)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setUserPaymentPaidPending])

	return (
		<Button
			onClick={() => {
				onClick()
				setClicked(true)
			}}
			type={type}
			loading={setUserPaymentPaidPending && clicked}
			classes={classes}
		>
			{name}
		</Button>
	)
}
