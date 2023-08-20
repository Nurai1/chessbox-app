import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUserCurrentPairApi } from 'src/api/requests/pair'
import { ErrorPayload, NearestPairResponse } from 'src/types'

export const fetchCurrentPairByCompetitionId = createAsyncThunk(
	'pair/currentPairByCompetitionId',
	async ({ competitionId, id }: { id: string; competitionId: string }, thunkApi) => {
		const response = await getUserCurrentPairApi(id, competitionId)
		if (response.error)
			return thunkApi.rejectWithValue({ errorMessage: response.error.error, response: response.response })

		return response.data
		// return {
		// 	roundDivider: 8,
		// 	pair: {
		// 		blackParticipant: '64bea0b5a63c8cebe24216ed',
		// 		calledForFight: false,
		// 		calledForPreparation: true,
		// 		judge: '649d650c902c2b82345768d2',
		// 		order: 0,
		// 		passed: true,
		// 		roundNumber: 0,
		// 		whiteParticipant: '649d6566902c2b82345768e0',
		// 		winner: '64bea0b5a63c8cebe24216ed',
		// 		_id: '64c9ff741ee28dbd19005884'
		// 	}
		// }
	}
)

export interface PairState {
	data: NearestPairResponse | null
	loading: boolean
	error?: string
}

const initialState: PairState = {
	data: null,
	loading: true
}

export const pairSlice = createSlice({
	name: 'pair',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchCurrentPairByCompetitionId.fulfilled.type]: (state, action: PayloadAction<NearestPairResponse>) => {
			state.loading = false
			state.data = action.payload
		},
		[fetchCurrentPairByCompetitionId.pending.type]: state => {
			state.loading = true
		},
		[fetchCurrentPairByCompetitionId.rejected.type]: (state, action: PayloadAction<ErrorPayload>) => {
			state.loading = false
			state.error = action.payload.errorMessage
		}
	}
})

// export const {} = pairSlice.actions

export default pairSlice.reducer
