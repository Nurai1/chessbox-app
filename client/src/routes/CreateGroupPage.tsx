import { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'

export const CreateGroupPage = (): ReactElement => {
	return (
		<div className='container m-auto text-center'>
			<p>Link for the next step below</p>
			<Link to={`../${AppRoute.OrdersGroupAssign}`} className='underline'>
				CreateGroupPage
			</Link>
		</div>
	)
}
