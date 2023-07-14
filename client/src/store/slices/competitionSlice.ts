import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CompetitionSchema, UserSchema } from 'src/types'
import { getCompetitionByIdApi, getCompetitionParticipantsApi } from 'src/api/requests/competitions'

export const fetchCompetitionById = createAsyncThunk('competition/fetchById', async (id: string, thunkApi) => {
	const response = await getCompetitionByIdApi(id)
	if (response.error) return thunkApi.rejectWithValue(response.error.error)

	return response.data
})

export const fetchCompetitionParticipants = createAsyncThunk(
	'competition/Participants',
	async (id: string, thunkApi) => {
		const response = await getCompetitionParticipantsApi(id)
		if (response.error) return thunkApi.rejectWithValue(response.error.error)

		return response.data
	}
)

export interface CompetitionState {
	data: CompetitionSchema | null
	participants: UserSchema[] | null
	loading: boolean
	error?: string
}

const initialState: CompetitionState = {
	data: null,
	participants: null,
	loading: true
}

export const competitionSlice = createSlice({
	name: 'competition',
	initialState,
	reducers: {
		clearParticipants: state => {
			state.participants = null
		}
	},
	extraReducers: {
		[fetchCompetitionById.fulfilled.type]: (state, action: PayloadAction<CompetitionSchema>) => {
			state.loading = false
			state.data = action.payload
		},
		[fetchCompetitionById.pending.type]: state => {
			state.loading = true
		},
		[fetchCompetitionById.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false
			state.error = action.payload
		},
		[fetchCompetitionParticipants.fulfilled.type]: (state, action: PayloadAction<UserSchema[]>) => {
			state.loading = false
			state.participants = action.payload
		},
		[fetchCompetitionParticipants.pending.type]: state => {
			state.loading = true
		},
		[fetchCompetitionParticipants.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false
			state.error = action.payload
		}
	}
})

export const { clearParticipants } = competitionSlice.actions

export default competitionSlice.reducer
