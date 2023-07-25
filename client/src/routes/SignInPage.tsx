import { ReactElement } from 'react'
import { SignInForm } from 'src/components/SignInForm'
import { AppRoute } from 'src/constants/appRoute'
import { useRedirectAuthorizedUser } from 'src/hooks/useRedirectAuthorizedUser'

export const SignInPage = (): ReactElement => {
	useRedirectAuthorizedUser(AppRoute.Root)

	return <SignInForm />
}
