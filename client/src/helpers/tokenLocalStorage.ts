import { AUTH_JWT_TOKEN_KEY } from 'src/constants/auth'

export const getToken = (): string => {
	return localStorage.getItem(AUTH_JWT_TOKEN_KEY) ?? ''
}

export const saveToken = (token: string): void => {
	localStorage.setItem(AUTH_JWT_TOKEN_KEY, token)
}

export const dropToken = (): void => {
	localStorage.removeItem(AUTH_JWT_TOKEN_KEY)
}
