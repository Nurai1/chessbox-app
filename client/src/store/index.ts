import { configureStore } from '@reduxjs/toolkit'
import usersReducer from 'src/store/slices/usersSlice'
import userReducer from 'src/store/slices/userSlice'
import competitionsReducer from 'src/store/slices/competitionsSlice'
import competitionReducer from 'src/store/slices/competitionSlice'

export const store = configureStore({
	reducer: {
		users: usersReducer,
		user: userReducer,
		competitions: competitionsReducer,
		competition: competitionReducer
	}
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
