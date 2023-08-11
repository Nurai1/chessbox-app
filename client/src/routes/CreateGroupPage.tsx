import { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'

export const CreateGroupPage = (): ReactElement => {
    return (
        // <h1>CreateGroupPage</h1>
        <Link to={`../${AppRoute.JudgeAssign}`}>CreateGroupPage</Link>
    )
}
