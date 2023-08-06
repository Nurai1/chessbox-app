import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

type BurgerPropsType = {
	onClick: () => void
	classes?: string
}
export const Burger: FC<BurgerPropsType> = ({ onClick, classes }) => {
	const lines =
		'absolute w-10 h-1 left-0 bg-black rounded-sm transition-opacity after:absolute after:bg-black after:w-10 after:h-1 after:rounded-sm after:bottom-3 after:left-0 before:absolute before:bg-black before:w-10 before:h-1 before:rounded-sm before:top-3 before:left-0'

	return (
		<button type='button' className={twMerge('relative h-7 w-10 p-1', classes)} onClick={onClick}>
			<span className={`${lines}`} />
		</button>
	)
}
