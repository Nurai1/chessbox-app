import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
	CompetitionSchema,
	ErrorPayload,
	UserSchema,
	SetCompetitionJudgesSchema,
	SetJudgesToPairsSchema,
	CompetitionSchemaJudge
} from 'src/types'
import {
	getCompetitionByIdApi,
	getCompetitionParticipantsApi,
	getCompetitionJudgesApi,
	setCompetitionJudgesApi,
	setJudgesToPairsApi
} from 'src/api/requests/competitions'

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

export const setPairJudges = createAsyncThunk(
	'competition/setPairJudges',
	async (data: SetJudgesToPairsSchema, thunkApi) => {
		const response = await setJudgesToPairsApi(data)
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
	setPairJudgeSuccess?: boolean
	setPairJudgeError?: string
	judgeAssignPending?: boolean
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
		setJudges: (state, action: PayloadAction<string[]>) => {
			if (state.data) {
				state.data.judges = action.payload
			}
			state.setCompetitionJudgesSuccess = undefined
		},
		resetPairJudgeSuccessStatus: (state) => {
			state.setPairJudgeSuccess = undefined
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
		[setCompetitionJudges.fulfilled.type]: (state, action: PayloadAction<CompetitionSchemaJudge>) => {
			state.judgeAssignPending = false
			state.setCompetitionJudgesSuccess = true
			state.judges = {
				[action.payload._id as string]: action.payload.judges
			}
		},
		[setCompetitionJudges.pending.type]: state => {
			state.judgeAssignPending = true
		},
		[setCompetitionJudges.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.judgeAssignPending = false
			state.setCompetitionJudgesError = action.payload.errorMessage
		},
		[setPairJudges.fulfilled.type]: (state) => {
			state.judgeAssignPending = false
			state.setPairJudgeSuccess = true
		},
		[setPairJudges.pending.type]: state => {
			state.judgeAssignPending = true
		},
		[setPairJudges.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.judgeAssignPending = false
			state.setPairJudgeError = action.payload.errorMessage
		}
	}
})

export const { setJudges, resetPairJudgeSuccessStatus } = competitionSlice.actions

export default competitionSlice.reducer
