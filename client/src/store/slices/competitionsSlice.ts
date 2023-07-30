import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CompetitionSchema, ErrorPayload } from 'src/types'
import { getCompetitionsApi } from 'src/api/requests/competitions'

export const fetchCompetitions = createAsyncThunk('competitions/fetchAll', async (_, thunkApi) => {
	const response = await getCompetitionsApi()
	if (response.error)
		return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

	return response.data
})

export interface CompetitionsState {
	data: CompetitionSchema[]
	error?: string
	loading: boolean
}

const initialState: CompetitionsState = {
	data: [],
	loading: true
}

export const competitionsSlice = createSlice({
	name: 'competitions',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchCompetitions.fulfilled.type]: (state, action: PayloadAction<CompetitionSchema[]>) => {
			state.loading = false
			state.data = action.payload ?? []
		},
		[fetchCompetitions.pending.type]: state => {
			state.loading = true
		},
		[fetchCompetitions.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.loading = false
			state.error = action.payload.errorMessage
		}
	}
})

// export const {} = competitionsSlice.actions

export default competitionsSlice.reducer
