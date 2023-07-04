import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUsersApi } from 'src/api/requests/users'
import { UserSchema } from 'src/types'

export const fetchUsers = createAsyncThunk(
	'users/fetchAll',
	async (query: { limit?: number; offset?: number }, thunkApi) => {
		const response = await getUsersApi(query)
		if (response.error) return thunkApi.rejectWithValue(response.error.error)

		return response.data
	}
)

interface ResponseData {
	items: UserSchema[]
	total: number
}

export interface UsersState {
	data: ResponseData
	error?: string
	loading: boolean
}

const initialState: UsersState = {
	data: {
		items: [],
		total: 0
	},
	loading: true
}

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchUsers.fulfilled.type]: (state, action: PayloadAction<ResponseData>) => {
			state.loading = false
			state.data = {
				total: action.payload.total || 0,
				items: [...state.data.items, ...action.payload.items]
			}
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
