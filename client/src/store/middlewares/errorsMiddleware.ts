import { Middleware } from '@reduxjs/toolkit'
import { dropToken } from 'src/helpers/tokenLocalStorage'
import { RootState } from '../rootReducer'
import { resetAuthStatus } from '../slices/userSlice'

export const errorsMiddleware: Middleware<Record<string, never>, RootState> = storeApi => next => action => {
	if (action.payload?.response?.status === 401) {
		dropToken()
		storeApi.dispatch(resetAuthStatus())
	}
	return next(action)
}
