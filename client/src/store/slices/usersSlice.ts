import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUsersApi } from 'src/api/requests/users'
import { UserSchema } from 'src/types'

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, thunkApi) => {
	const response = await getUsersApi()
	if (response.error) return thunkApi.rejectWithValue(response.error.error)

	return response.data
})

export interface UsersState {
	data: UserSchema[]
	error?: string
	loading: boolean
}

const initialState: UsersState = {
	data: [],
	loading: false
}

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchUsers.fulfilled.type]: (state, action: PayloadAction<UserSchema[]>) => {
			state.loading = false
			state.data = action.payload ?? []
		},
		[fetchUsers.pending.type]: state => {
			state.loading = true
		},
		[fetchUsers.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false
			state.error = action.payload
		}
	}
})

// export const {} = usersSlice.actions

export default usersSlice.reducer
