import { ReactElement } from 'react'
import { SignUpForm } from 'src/components/SignUpForm'
import { useRedirectAuthorizedUser } from 'src/hooks/useRedirectAuthorizedUser'
import { AppRoute } from 'src/constants/appRoute'

export const SignUpPage = (): ReactElement => {
	useRedirectAuthorizedUser(AppRoute.Root)

	return <SignUpForm />
}
