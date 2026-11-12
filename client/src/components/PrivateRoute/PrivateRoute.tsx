import { FC, ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from 'src/hooks/redux'
import { AuthorizationStatus } from 'src/constants/authorizationStatus'
import { Role } from 'src/constants/role'
import { AppRoute } from 'src/constants/appRoute'
import { Loader } from 'src/ui'

type PrivateRoutePropsType = {
	children: ReactElement
	requiredRole: Role | Role[]
	redirectPath?: string
}

const PrivateRoute: FC<PrivateRoutePropsType> = ({
	children,
	redirectPath = `/${AppRoute.NotFound}`,
	requiredRole
}): ReactElement => {
	const authorizationStatus = useAppSelector(state => state.user.authorizationStatus)
	const authorizedUserRole = useAppSelector(state => state.user.authorizedUser)?.role

	if (authorizationStatus === AuthorizationStatus.Unknown) {
		return <Loader />
	}

	if (authorizationStatus === AuthorizationStatus.NoAuth) {
		return <Navigate to={redirectPath} />
	}

	const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
	if (authorizationStatus === AuthorizationStatus.Auth && allowedRoles.some(value => value === authorizedUserRole)) {
		return children
	}

	return <Navigate to={redirectPath} />
}

export { PrivateRoute }
