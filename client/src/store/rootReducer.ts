import { combineReducers } from '@reduxjs/toolkit'
import competitionReducer from 'src/store/slices/competitionSlice'
import competitionsReducer from 'src/store/slices/competitionsSlice'
import userReducer from 'src/store/slices/userSlice'
import usersReducer from 'src/store/slices/usersSlice'

export const rootReducer = combineReducers({
	users: usersReducer,
	user: userReducer,
	competitions: competitionsReducer,
	competition: competitionReducer
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>
