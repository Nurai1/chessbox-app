import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
	CompetitionSchema,
	ErrorPayload,
	UserSchema,
	SetCompetitionJudgesSchema,
	SetJudgesToPairsSchema,
	CompetitionGroupsOrdersSchema
} from 'src/types'
import {
	getCompetitionByIdApi,
	getCompetitionParticipantsApi,
	getCompetitionJudgesApi,
	setCompetitionJudgesApi,
	setJudgesToPairsApi,
	setCompetitionGroupsOrdersApi
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

export const fetchCompetitionJudges = createAsyncThunk('competition/Judges', async (id: string, thunkApi) => {
	const response = await getCompetitionJudgesApi(id)
	if (response.error)
		return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

	return { competitionId: id, judges: response.data }
})

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

export const setCompetitionGroupsOrders = createAsyncThunk(
	'competition/setCompetitionGroupsOrders',
	async ({ orders, id }: { orders: CompetitionGroupsOrdersSchema; id: string }, thunkApi) => {
		const response = await setCompetitionGroupsOrdersApi(orders, id)
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
	setCompetitionJudgesPending?: boolean
	setPairJudgesSuccess?: boolean
	setPairJudgesError?: string
	setPairJudgesPending?: boolean
	groupOrderAssignSuccess?: boolean
	groupOrderAssignError?: string
	groupOrderAssignPending?: boolean
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
		setJudgesToCompetition: (state, action: PayloadAction<{ competitionId: string; judges: UserSchema[] }>) => {
			if (state) {
				state.judges[action.payload.competitionId] = action.payload.judges
			}
			state.setCompetitionJudgesSuccess = undefined
		},
		setCompetitionData: (state, action: PayloadAction<CompetitionSchema>) => {
			state.data = action.payload
		},
		resetCompetitionGroupsOrdersStatus: state => {
			state.groupOrderAssignSuccess = undefined
		},
		resetPairJudgeAssignStatus: state => {
			state.groupOrderAssignSuccess = undefined
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
		[fetchCompetitionJudges.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false
			state.error = action.payload
		},
		[setCompetitionJudges.fulfilled.type]: state => {
			state.setCompetitionJudgesPending = false
			state.setCompetitionJudgesSuccess = true
		},
		[setCompetitionJudges.pending.type]: state => {
			state.setCompetitionJudgesPending = true
		},
		[setCompetitionJudges.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.setCompetitionJudgesPending = false
			state.setCompetitionJudgesError = action.payload.errorMessage
		},
		[setPairJudges.fulfilled.type]: state => {
			state.setPairJudgesPending = false
			state.setPairJudgesSuccess = true
		},
		[setPairJudges.pending.type]: state => {
			state.setPairJudgesPending = true
		},
		[setPairJudges.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.setPairJudgesPending = false
			state.setPairJudgesError = action.payload.errorMessage
		},
		[setCompetitionGroupsOrders.fulfilled.type]: state => {
			state.groupOrderAssignPending = false
			state.groupOrderAssignSuccess = true
		},
		[setCompetitionGroupsOrders.pending.type]: state => {
			state.groupOrderAssignPending = true
		},
		[setCompetitionGroupsOrders.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.groupOrderAssignPending = false
			state.groupOrderAssignError = action.payload.errorMessage
		}
	}
})

export const {
	setJudgesToCompetition,
	setCompetitionData,
	resetCompetitionGroupsOrdersStatus,
	resetPairJudgeAssignStatus
} = competitionSlice.actions

export default competitionSlice.reducer
