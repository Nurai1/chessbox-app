import { FC, ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from 'src/hooks/redux'
import { AuthorizationStatus } from 'src/constants/authorizationStatus'
import { AppRoute } from 'src/constants/appRoute'
import { Loader } from 'src/ui'

type PrivateRoutePropsType = {
	children: ReactElement
	redirectPath?: string
}

const PrivateRoute: FC<PrivateRoutePropsType> = ({ children, redirectPath = `/${AppRoute.SignIn}` }): ReactElement => {
	const authorizationStatus = useAppSelector(state => state.user.authorizationStatus)

	if (authorizationStatus === AuthorizationStatus.Unknown) {
		return <Loader />
	}

	if (authorizationStatus === AuthorizationStatus.NoAuth) {
		return <Navigate to={redirectPath} />
	}

	return children
}

export { PrivateRoute }
