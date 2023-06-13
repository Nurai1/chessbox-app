import { ReactElement } from 'react'
import { Button } from '../ui'

export const Main = (): ReactElement => {
	const clickHandler = (): void => {}
	return (
		<div className='flex flex-col gap-2 p-4'>
			<Button onClick={clickHandler} type='primary'>
				Button
			</Button>
			<Button onClick={clickHandler} type='outlined'>
				Button
			</Button>
			<Button onClick={clickHandler} type='ghost'>
				Button
			</Button>

			<Button onClick={clickHandler} type='primary' loading>
				Button
			</Button>
			<Button onClick={clickHandler} type='outlined' loading>
				Button
			</Button>
			<Button onClick={clickHandler} type='ghost' loading>
				Button
			</Button>

			<Button onClick={clickHandler} type='primary' disabled>
				Button
			</Button>
			<Button onClick={clickHandler} type='outlined' disabled>
				Button
			</Button>
			<Button onClick={clickHandler} type='ghost' disabled>
				Button
			</Button>
		</div>
	)
}
