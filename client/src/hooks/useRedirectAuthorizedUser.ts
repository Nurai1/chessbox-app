import { useEffect } from 'react'
import { useAppSelector } from 'src/hooks/redux'
import { AuthorizationStatus } from 'src/constants/authorizationStatus'
import { useNavigate } from 'react-router-dom'

export const useRedirectAuthorizedUser = (path: string) => {
	const authStatus = useAppSelector(state => state.user.authorizationStatus)
	const navigate = useNavigate()

	useEffect(() => {
		if (authStatus === AuthorizationStatus.Auth) {
			navigate(path)
		}
	})
}
