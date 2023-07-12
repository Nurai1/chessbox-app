import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUsersApi } from 'src/api/requests/users'
import { UserSchema } from 'src/types'
import { UserFilterType } from 'src/components/UserFilter'

export const fetchUsers = createAsyncThunk(
	'users/fetchAll',
	async (
		query: {
			limit?: number
			offset?: number
			search?: string
			ageFrom?: number
			ageTo?: number
			weightFrom?: number
			weightTo?: number
			withWomen?: boolean
			withMen?: boolean
		},
		thunkApi
	) => {
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
	loading: boolean
	loaded: boolean
	filterState: UserFilterType
	error?: string
}

const initialState: UsersState = {
	data: {
		items: [],
		total: 0
	},
	loading: true,
	loaded: false,
	filterState: {}
}

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setUserFilter: (state, action) => {
			state.filterState = action.payload
		},
		clearUsers: state => {
			state.data.total = 0
			state.data.items = []
		}
	},
	extraReducers: {
		[fetchUsers.fulfilled.type]: (state, action: PayloadAction<ResponseData>) => {
			state.loading = false
			state.loaded = true
			state.data = {
				total: action.payload.total || 0,
				items: [...state.data.items, ...action.payload.items]
			}
		},
		[fetchUsers.pending.type]: state => {
			state.loading = true
			state.loaded = false
		},
		[fetchUsers.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false
			state.error = action.payload
		}
	}
})

export const { setUserFilter, clearUsers } = usersSlice.actions

export default usersSlice.reducer
