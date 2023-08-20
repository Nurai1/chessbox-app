import { combineReducers } from '@reduxjs/toolkit'
import competitionReducer from 'src/store/slices/competitionSlice'
import competitionsReducer from 'src/store/slices/competitionsSlice'
import userReducer from 'src/store/slices/userSlice'
import usersReducer from 'src/store/slices/usersSlice'
import pairReducer from './slices/pairSlice'

export const rootReducer = combineReducers({
	users: usersReducer,
	user: userReducer,
	competitions: competitionsReducer,
	competition: competitionReducer,
	pair: pairReducer
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>
