import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { EditProfileForm } from 'src/components'
import { AppRoute } from 'src/constants/appRoute'
import { AuthorizationStatus } from 'src/constants/authorizationStatus'
import { useAppSelector } from 'src/hooks/redux'

export const EditProfilePage = (): ReactElement => {
	const authStatus = useAppSelector(state => state.user.authorizationStatus)

	if (authStatus === AuthorizationStatus.NoAuth) {
		return <Navigate to={`/${AppRoute.SignIn}`} />
	}

	return <EditProfileForm />
}
