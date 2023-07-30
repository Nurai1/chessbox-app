import { configureStore } from '@reduxjs/toolkit'
import { errorsMiddleware } from './middlewares/errorsMiddleware'
import { rootReducer } from './rootReducer'

export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(errorsMiddleware)
})

export type AppDispatch = typeof store.dispatch
