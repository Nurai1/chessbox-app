import { AUTH_JWT_TOKEN_KEY } from 'src/constants/auth'

export const getToken = (): string => {
	return sessionStorage.getItem(AUTH_JWT_TOKEN_KEY) ?? ''
}

export const saveToken = (token: string): void => {
	sessionStorage.setItem(AUTH_JWT_TOKEN_KEY, token)
}

export const dropToken = (): void => {
	sessionStorage.removeItem(AUTH_JWT_TOKEN_KEY)
}
