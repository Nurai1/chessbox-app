import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUsersApi, getAllJudges } from 'src/api/requests/users'
import { ErrorPayload, UserSchema } from 'src/types'
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
		const response = await getUsersApi({ ...query, role: 'participant' })
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export const fetchAllJudges = createAsyncThunk('user/getAllJudges', async (_, thunkApi) => {
	const response = await getAllJudges()
	if (response.error)
		return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

	return response.data
})

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
	allJudges?: UserSchema[]
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
		},
		resetFilter: state => {
			state.filterState = {}
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
		[fetchUsers.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.loading = false
			state.error = action.payload.errorMessage
		},
		[fetchAllJudges.fulfilled.type]: (state, action: PayloadAction<UserSchema[]>) => {
			state.loading = false
			state.allJudges = action.payload
		},
		[fetchAllJudges.pending.type]: state => {
			state.loading = true
		},
		[fetchAllJudges.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.loading = false
			state.error = action.payload.errorMessage
		}
	}
})

export const { setUserFilter, clearUsers, resetFilter } = usersSlice.actions

export default usersSlice.reducer
