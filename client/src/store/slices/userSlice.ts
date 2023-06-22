import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUserByIdApi } from 'src/api/requests/users'
import { UserSchema } from 'src/types'

export const fetchUserById = createAsyncThunk('users/fetchById', async (id: string, thunkApi) => {
	const response = await getUserByIdApi(id)
	if (response.error) return thunkApi.rejectWithValue(response.error.error)

	return response.data
})

export interface UserState {
	data: UserSchema | null
	error?: string
	loading: boolean
}

const initialState: UserState = {
	data: null,
	loading: false
}

export const currentUserSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchUserById.fulfilled.type]: (state, action: PayloadAction<UserSchema>) => {
			state.loading = false

			state.data = action.payload ?? null
		},
		[fetchUserById.pending.type]: state => {
			state.loading = true
		},
		[fetchUserById.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false
			state.error = action.payload
		}
	}
})

// export const {} = currentUserSlice.actions

export default currentUserSlice.reducer
