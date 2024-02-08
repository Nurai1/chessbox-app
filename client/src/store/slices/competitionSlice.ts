import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
	AcceptPairFightBodySchema,
	CompetitionGroupSchema,
	CompetitionGroupsOrdersSchema,
	CompetitionSchema,
	DeleteCompetitionGroupSchema,
	ErrorPayload,
	ParticipantSchema,
	SetCompetitionJudgesSchema,
	SetJudgesToPairsSchema,
	CallPairPreparationSchema,
	DefineWinnerSchema,
	UserSchema,
	LaunchNextGroupRoundApiSchema,
	CompetitionPaymentDataType,
	CompetitionPaymentPaidType,
	ParticipantsOrdersByGroupSchema
} from 'src/types'

import {
	getCompetitionByIdApi,
	getCompetitionParticipantsApi,
	getCompetitionJudgesApi,
	setCompetitionJudgesApi,
	setJudgesToPairsApi,
	setCompetitionGroupsOrdersApi,
	setCompetitionGroupsApi,
	deleteCompetitionGroupApi,
	addNewParticipantApi,
	setBreakTimeApi,
	callPairPreparationApi,
	defineWinnerApi,
	acceptForFightApi,
	launchNextGroupRoundApi,
	seTuserPaymentRequestToCheckApi,
	getPaymentInfoUsersApi,
	setUserPaymentPaidApi,
	startCompetitionApi,
	recalculatePairsTimeApi,
	setParticipantsOrdersByGroupApi
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

export const recalculatePairsTime = createAsyncThunk(
	'competition/recalculatePairsTime',
	async (id: string, thunkApi) => {
		const response = await recalculatePairsTimeApi(id)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
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

export const startCompetition = createAsyncThunk('competition/startCompetition', async (id: string, thunkApi) => {
	const response = await startCompetitionApi(id)
	if (response.error)
		return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

	return response.data
})

export const setPairJudges = createAsyncThunk(
	'competition/setPairJudges',
	async (data: SetJudgesToPairsSchema, thunkApi) => {
		const response = await setJudgesToPairsApi(data)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export const setParticipantsOrdersByGroup = createAsyncThunk(
	'competition/setParticipantsOrdersByGroup',
	async ({ data, id }: { data: ParticipantsOrdersByGroupSchema; id: string }, thunkApi) => {
		const response = await setParticipantsOrdersByGroupApi(data, id)
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

export const setCompetitionGroups = createAsyncThunk(
	'competition/setCompetitionGroups',
	async ({ competition, id }: { competition: CompetitionGroupSchema; id: string }, thunkApi) => {
		const response = await setCompetitionGroupsApi(competition, id)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export const deleteCompetitionGroup = createAsyncThunk(
	'competition/deleteCompetitionGroup',
	async ({ groupId, id }: { groupId: DeleteCompetitionGroupSchema; id: string }, thunkApi) => {
		const response = await deleteCompetitionGroupApi(groupId, id)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export const addNewParticipant = createAsyncThunk(
	'competition/addNewParticipant',
	async ({ userId, id }: { userId: string; id: string }, thunkApi) => {
		const response = await addNewParticipantApi(userId, id)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export const setBreakTime = createAsyncThunk(
	'competition/setBreakTime',
	async ({ breakTimeMinutes, id }: { breakTimeMinutes: number; id: string }, thunkApi) => {
		const response = await setBreakTimeApi(breakTimeMinutes, id)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export const callPairPreparation = createAsyncThunk(
	'competition/callPairPreparationApi',
	async (callPairPreparationData: CallPairPreparationSchema, thunkApi) => {
		const response = await callPairPreparationApi(callPairPreparationData)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export const defineWinner = createAsyncThunk(
	'competition/defineWinner',
	async (winnerData: DefineWinnerSchema, thunkApi) => {
		const response = await defineWinnerApi(winnerData)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export const acceptForFight = createAsyncThunk(
	'competition/acceptForFight',
	async (body: AcceptPairFightBodySchema, thunkApi) => {
		const response = await acceptForFightApi(body)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export const launchNextGroupRound = createAsyncThunk(
	'competition/launchNextGroupRound',
	async (body: LaunchNextGroupRoundApiSchema, thunkApi) => {
		const response = await launchNextGroupRoundApi(body)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export const seTuserPaymentRequestToCheck = createAsyncThunk(
	'payment/seTuserPaymentRequestToCheck',
	async (competitionPaymentData: CompetitionPaymentDataType, thunkApi) => {
		const { path, body } = competitionPaymentData
		const response = await seTuserPaymentRequestToCheckApi(body, path)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export const getPaymentInfoUsers = createAsyncThunk(
	'payment/getPaymentInfoUsers',
	async (competitionId: string, thunkApi) => {
		const response = await getPaymentInfoUsersApi(competitionId)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export const setUserPaymentPaid = createAsyncThunk(
	'payment/setUserPaymentPaid',
	async (userPaymentData: CompetitionPaymentPaidType, thunkApi) => {
		const { path, body } = userPaymentData
		const response = await setUserPaymentPaidApi(body, path)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
	}
)

export interface CompetitionState {
	data: CompetitionSchema | null
	participants: Record<string, ParticipantSchema[] | null>
	judges: Record<string, UserSchema[] | null>
	loading: boolean
	callUpTimerRunningIds: string[]
	paymentInfoUsers?: UserSchema[]
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
	groupAddSuccess?: boolean
	groupAddError?: string
	groupAddPending?: boolean
	groupDeletePending?: boolean
	groupDeleteSuccess?: boolean
	groupDeleteError?: string
	addNewParticipantPending?: boolean
	addNewParticipantError?: string
	addNewParticipantSuccess?: boolean
	setBreakTimePending?: boolean
	setBreakTimeSuccess?: boolean
	setBreakTimeError?: string
	callPairPreparationPending?: boolean
	callPairPreparationSuccess?: boolean
	callPairPreparationError?: string
	defineWinnerPending?: boolean
	defineWinnerSuccess?: boolean
	defineWinnerError?: string
	launchNextGroupRoundPending?: boolean
	launchNextGroupRoundSuccess?: boolean
	launchNextGroupRoundError?: string
	acceptForFightPending?: boolean
	acceptForFightSuccess?: boolean
	acceptForFightError?: string
	seTuserPaymentRequestToCheckPending?: boolean
	seTuserPaymentRequestToCheckSuccess?: boolean
	seTuserPaymentRequestToCheckError?: string
	getPaymentInfoUsersPending?: boolean
	getPaymentInfoUsersSuccess?: boolean
	getPaymentInfoUsersError?: string
	setUserPaymentPaidPending?: boolean
	setUserPaymentPaidSuccess?: boolean
	setUserPaymentPaidError?: string
}

const initialState: CompetitionState = {
	data: null,
	participants: {},
	judges: {},
	loading: true,
	callUpTimerRunningIds: []
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
		},
		resetCompetitionGroupsStatus: state => {
			state.groupAddSuccess = undefined
		},
		resetDeleteCompetitionGroupStatus: state => {
			state.groupDeleteSuccess = undefined
		},
		setBreakTimeLocalState: (state, action: PayloadAction<number>) => {
			return {
				...state,
				data: {
					...(state.data as CompetitionSchema),
					breakTime: {
						...state.data?.breakTime,
						minutes: action.payload
					}
				}
			}
		},
		resetBreakTime: state => {
			return {
				...state,
				setBreakTimeError: undefined,
				setBreakTimeSuccess: undefined,
				data: {
					...(state.data as CompetitionSchema),
					breakTime: undefined
				}
			}
		},
		resetBreakTimeSuccess: state => {
			state.setBreakTimeSuccess = undefined
		},
		addValuecallUpTimerRunningIds: (state, action: PayloadAction<string>) => {
			state.callUpTimerRunningIds.push(action.payload)
		},
		removeValuecallUpTimerRunningIds: (state, action: PayloadAction<string>) => {
			state.callUpTimerRunningIds = state.callUpTimerRunningIds.filter(item => item !== action.payload)
		},
		// delete if unused
		addCompetitionParticipant: (
			state,
			action: PayloadAction<{ newParticipant: UserSchema; competitionId: string }>
		) => {
			state.participants[action.payload.competitionId]?.push(action.payload.newParticipant)
		},
		resetAcceptForFightSuccess: state => {
			state.acceptForFightSuccess = true
		}
	},
	extraReducers: {
		[startCompetition.fulfilled.type]: (state, action: PayloadAction<CompetitionSchema>) => {
			state.loading = false
			state.data = action.payload
		},
		[startCompetition.pending.type]: state => {
			state.loading = true
		},
		[startCompetition.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false
			state.error = action.payload
		},
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
		[setPairJudges.fulfilled.type]: (state, action: PayloadAction<CompetitionSchema>) => {
			state.data = action.payload
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
		},
		[setParticipantsOrdersByGroup.pending.type]: state => {
			state.loading = true
		},
		[setParticipantsOrdersByGroup.fulfilled.type]: (state, action: PayloadAction<CompetitionSchema>) => {
			state.loading = true
			state.data = action.payload
		},
		[setParticipantsOrdersByGroup.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.loading = false
			state.error = action.payload.errorMessage
		},
		[setCompetitionGroups.fulfilled.type]: (state, action: PayloadAction<CompetitionSchema>) => {
			state.data = action.payload
			state.groupAddPending = false
			state.groupAddSuccess = true
		},
		[setCompetitionGroups.pending.type]: state => {
			state.groupAddPending = true
		},
		[setCompetitionGroups.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.groupAddPending = false
			state.groupAddError = action.payload.errorMessage
		},
		[deleteCompetitionGroup.fulfilled.type]: (state, action: PayloadAction<CompetitionSchema>) => {
			state.data = action.payload
			state.groupDeletePending = false
			state.groupDeleteSuccess = true
		},
		[deleteCompetitionGroup.pending.type]: state => {
			state.groupDeletePending = true
		},
		[deleteCompetitionGroup.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.groupDeletePending = false
			state.groupDeleteError = action.payload.errorMessage
		},
		[addNewParticipant.fulfilled.type]: state => {
			state.addNewParticipantPending = false
			state.addNewParticipantSuccess = true
		},
		[addNewParticipant.pending.type]: state => {
			state.addNewParticipantPending = true
			state.addNewParticipantError = undefined
			state.addNewParticipantSuccess = undefined
		},
		[addNewParticipant.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.addNewParticipantPending = false
			state.addNewParticipantError = action.payload.errorMessage
		},
		[setBreakTime.fulfilled.type]: state => {
			state.setBreakTimeSuccess = true
			state.setBreakTimePending = false
		},
		[setBreakTime.pending.type]: state => {
			state.setBreakTimePending = true
		},
		[setBreakTime.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.setBreakTimePending = false
			state.setBreakTimeError = action.payload.errorMessage
		},
		[callPairPreparation.fulfilled.type]: (state, action: PayloadAction<CompetitionSchema>) => {
			state.data = action.payload
			state.callPairPreparationSuccess = true
			state.callPairPreparationPending = false
		},
		[callPairPreparation.pending.type]: state => {
			state.callPairPreparationPending = true
			state.callPairPreparationError = undefined
		},
		[callPairPreparation.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.callPairPreparationPending = false
			state.callPairPreparationError = action.payload.errorMessage
		},
		[defineWinner.fulfilled.type]: (state, action: PayloadAction<CompetitionSchema>) => {
			state.data = action.payload
			state.defineWinnerPending = false
			state.defineWinnerSuccess = true
		},
		[defineWinner.pending.type]: state => {
			state.defineWinnerPending = true
			state.defineWinnerError = undefined
		},
		[defineWinner.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.defineWinnerPending = false
			state.defineWinnerError = action.payload.errorMessage
		},
		[acceptForFight.fulfilled.type]: (state, action: PayloadAction<CompetitionSchema>) => {
			state.acceptForFightPending = false
			state.acceptForFightSuccess = true
			state.data = action.payload
		},
		[acceptForFight.pending.type]: state => {
			state.acceptForFightPending = true
			state.acceptForFightSuccess = undefined
		},
		[acceptForFight.rejected.type]: (state, action: PayloadAction<string>) => {
			state.acceptForFightPending = false
			state.acceptForFightError = action.payload
		},
		[launchNextGroupRound.fulfilled.type]: (state, action: PayloadAction<CompetitionSchema>) => {
			state.data = action.payload
			state.launchNextGroupRoundPending = false
			state.launchNextGroupRoundSuccess = true
		},
		[launchNextGroupRound.pending.type]: state => {
			state.launchNextGroupRoundPending = true
			state.launchNextGroupRoundError = undefined
		},
		[launchNextGroupRound.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.launchNextGroupRoundPending = false
			state.launchNextGroupRoundError = action.payload.errorMessage
		},
		[seTuserPaymentRequestToCheck.fulfilled.type]: (state, action: PayloadAction<CompetitionSchema>) => {
			state.data = action.payload
			state.seTuserPaymentRequestToCheckPending = false
			state.seTuserPaymentRequestToCheckSuccess = true
		},
		[seTuserPaymentRequestToCheck.pending.type]: state => {
			state.seTuserPaymentRequestToCheckPending = true
		},
		[seTuserPaymentRequestToCheck.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.seTuserPaymentRequestToCheckPending = false
			state.seTuserPaymentRequestToCheckError = action.payload.errorMessage
		},
		[getPaymentInfoUsers.fulfilled.type]: (state, action: PayloadAction<UserSchema[]>) => {
			state.paymentInfoUsers = action.payload
			state.getPaymentInfoUsersPending = false
			state.getPaymentInfoUsersSuccess = true
		},
		[getPaymentInfoUsers.pending.type]: state => {
			state.getPaymentInfoUsersPending = true
		},
		[getPaymentInfoUsers.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.getPaymentInfoUsersPending = false
			state.getPaymentInfoUsersError = action.payload.errorMessage
		},
		[setUserPaymentPaid.fulfilled.type]: (state, action: PayloadAction<CompetitionSchema>) => {
			state.data = action.payload
			state.setUserPaymentPaidPending = false
			state.setUserPaymentPaidSuccess = true
		},
		[setUserPaymentPaid.pending.type]: state => {
			state.setUserPaymentPaidPending = true
		},
		[setUserPaymentPaid.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.setUserPaymentPaidPending = false
			state.setUserPaymentPaidError = action.payload.errorMessage
		}
	}
})

export const {
	setJudgesToCompetition,
	setCompetitionData,
	resetCompetitionGroupsOrdersStatus,
	resetPairJudgeAssignStatus,
	resetCompetitionGroupsStatus,
	resetDeleteCompetitionGroupStatus,
	setBreakTimeLocalState,
	resetBreakTime,
	resetBreakTimeSuccess,
	addValuecallUpTimerRunningIds,
	removeValuecallUpTimerRunningIds,
	addCompetitionParticipant,
	resetAcceptForFightSuccess
} = competitionSlice.actions

export default competitionSlice.reducer
