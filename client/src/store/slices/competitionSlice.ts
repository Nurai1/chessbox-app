import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CompetitionSchema, ErrorPayload, UserSchema, SetCompetitionJudgesSchema } from 'src/types'
import { getCompetitionByIdApi, getCompetitionParticipantsApi, getCompetitionJudgesApi, setCompetitionJudgesApi } from 'src/api/requests/competitions'

export const fetchCompetitionById = createAsyncThunk('competition/fetchById', async (id: string, thunkApi) => {
	const response = await getCompetitionByIdApi(id)
	if (response.error)
		return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

	return response.data
})

export const fetchCompetitionParticipants = createAsyncThunk(
	'competition/Participants',
	async (id: string, thunkApi) => {
		const response = await getCompetitionParticipantsApi(id)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return { competitionId: id, participants: response.data }
	}
)

export const fetchCompetitionJudges = createAsyncThunk(
	'competition/Judges',
	async (id: string, thunkApi) => {
		const response = await getCompetitionJudgesApi(id)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return { competitionId: id, judges: response.data }
	}
)

export const setCompetitionJudges = createAsyncThunk(
	'competition/setCompetitionJudges',
	async (data: SetCompetitionJudgesSchema, thunkApi) => {
		const response = await setCompetitionJudgesApi(data)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export interface CompetitionState {
	data: CompetitionSchema | null
	participants: Record<string, UserSchema[] | null>
	judges: Record<string, UserSchema[] | null>
	loading: boolean
	error?: string
	setCompetitionJudgesSuccess?: boolean
	setCompetitionJudgesError?: string
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
	reducers: {
		updateCompetition: (state, action: PayloadAction<string[]>) => {
			if (state.data) {
				state.data.judges = action.payload
			}
			state.setCompetitionJudgesSuccess = undefined
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
		[fetchCompetitionParticipants.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.loading = false
			state.error = action.payload.errorMessage
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
		[fetchCompetitionJudges.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.loading = false
			state.error = action.payload.errorMessage
		},
		[setCompetitionJudges.fulfilled.type]: (state,  action: PayloadAction<CompetitionSchema>) => {
			state.loading = false
			state.setCompetitionJudgesSuccess = true
		},
		[setCompetitionJudges.pending.type]: state => {
			state.loading = true
		},
		[setCompetitionJudges.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.loading = false
			state.setCompetitionJudgesError = action.payload.errorMessage
		}
	}
})

export const { updateCompetition } = competitionSlice.actions

export default competitionSlice.reducer
