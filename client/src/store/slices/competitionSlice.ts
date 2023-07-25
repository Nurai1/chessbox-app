import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CompetitionSchema, UserSchema } from 'src/types'
import {
	getCompetitionByIdApi,
	getCompetitionParticipantsApi,
	getCompetitionJudgesApi
} from 'src/api/requests/competitions'

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

		return { competitionId: id, participants: response.data }
	}
)

export const fetchCompetitionJudges = createAsyncThunk('competition/Judges', async (id: string, thunkApi) => {
	const response = await getCompetitionJudgesApi(id)
	if (response.error) return thunkApi.rejectWithValue(response.error.error)

	return { competitionId: id, judges: response.data }
})

export interface CompetitionState {
	data: CompetitionSchema | null
	participants: Record<string, UserSchema[] | null>
	judges: Record<string, UserSchema[] | null>
	loading: boolean
	error?: string
}

const initialState: CompetitionState = {
	data: null,
	participants: {},
	judges: {},
	loading: true
}

export const competitionSlice = createSlice({
	name: 'competition',
	initialState,
	reducers: {},
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
		[fetchCompetitionParticipants.fulfilled.type]: (
			state,
			action: PayloadAction<{ competitionId: string; participants: UserSchema[] }>
		) => {
			state.loading = false
			state.participants[action.payload.competitionId] = action.payload.participants
		},
		[fetchCompetitionParticipants.pending.type]: state => {
			state.loading = true
		},
		[fetchCompetitionParticipants.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false
			state.error = action.payload
		},
		[fetchCompetitionJudges.fulfilled.type]: (
			state,
			action: PayloadAction<{ competitionId: string; judges: UserSchema[] }>
		) => {
			state.loading = false
			state.judges[action.payload.competitionId] = action.payload.judges
		},
		[fetchCompetitionJudges.pending.type]: state => {
			state.loading = true
		},
		[fetchCompetitionJudges.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false
			state.error = action.payload
		}
	}
})

// export const {} = competitionSlice.actions

export default competitionSlice.reducer
