import { ReactElement } from 'react'
import { useAppSelector } from 'src/hooks/redux'
import { Navigate } from 'react-router-dom'
import { SignInForm } from 'src/components/SignInForm'
import { AuthorizationStatus } from 'src/constants/authorizationStatus'
import { AppRoute } from 'src/constants/appRoute'

export const SignInPage = (): ReactElement => {
	const authStatus = useAppSelector(state => state.user.authorizationStatus)

	if (authStatus === AuthorizationStatus.Auth) {
		return <Navigate to={AppRoute.Root} />
	}

	return (
		<SignInForm/>
	)
}
