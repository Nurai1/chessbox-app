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
	reducers: {
		updateCompetitionsListJudges: (state, action: PayloadAction<{ selectedJudges: string[]; competitionId: string }>) => {
			if (state.data.length) {
				const competition = state.data.find(({ _id }) => _id === action.payload.competitionId)
				if (competition) {
					competition.judges = action.payload.selectedJudges
				}
			}
		},
		updateCompetitionsListBreakTime: (state, action: PayloadAction<{ breakTimeMinutes: number; competitionId: string }>) => {
			if (state.data.length) {
				const competitionIndex = state.data.findIndex(({ _id }) => _id === action.payload.competitionId)
				state.data[competitionIndex] = {
					...state.data[competitionIndex],
					breakTime: {
						minutes: action.payload.breakTimeMinutes
					}
				}
			}
		},
		resetCompetitionsListBreakTime: (state, action: PayloadAction<string>) => {
			if (state.data.length) {
				const competitionIndex = state.data.findIndex(({ _id }) => _id === action.payload)
				state.data[competitionIndex] = {
					...state.data[competitionIndex],
					breakTime: undefined
				}
			}
		}
	},
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

export const { updateCompetitionsListJudges, updateCompetitionsListBreakTime, resetCompetitionsListBreakTime } = competitionsSlice.actions

export default competitionsSlice.reducer
