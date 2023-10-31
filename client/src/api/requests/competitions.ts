import { get, patch, post, del } from 'src/api/api'
import {
	SetCompetitionJudgesSchema,
	SetJudgesToPairsSchema,
	CompetitionGroupsOrdersSchema,
	CompetitionGroupSchema,
	DeleteCompetitionGroupSchema,
	AddNewParticipantSchema,
	CallPairPreparationSchema,
	DefineWinnerSchema,
	AcceptPairFightBodySchema, 
	LaunchNextGroupRoundApiSchema
} from 'src/types'

export const getCompetitionsApi = async () => {
	const result = await get('/api/competitions', {})

	return result
}

export const getCompetitionByIdApi = async (id: string) => {
	const result = await get('/api/competition/{id}', {
		params: {
			path: {
				id
			}
		}
	})

	return result
}

export const getCompetitionParticipantsApi = async (id: string) => {
	const result = await get('/api/competition/{id}/participants', {
		params: {
			path: {
				id
			}
		}
	})

	return result
}

export const getCompetitionJudgesApi = async (id: string) => {
	const result = await get('/api/competition/{id}/judges', {
		params: {
			path: {
				id
			}
		}
	})

	return result
}

export const setCompetitionJudgesApi = async (data: SetCompetitionJudgesSchema) => {
	const result = await patch('/api/competition/setJudgesToCompetition', {
		body: data
	})

	return result
}

export const setJudgesToPairsApi = async (data: SetJudgesToPairsSchema) => {
	const result = await patch('/api/competition/setJudgesToPairs', {
		body: data
	})

	return result
}

export const setCompetitionGroupsOrdersApi = async (data: CompetitionGroupsOrdersSchema, id: string) => {
	const result = await patch('/api/competition/{id}/setCompetitionGroupsOrders', {
		body: data,
		params: {
			path: {
				id
			}
		}
	})

	return result
}

export const setCompetitionGroupsApi = async (data: CompetitionGroupSchema, id: string) => {
	const result = await post('/api/competition/{id}/group', {
		body: data,
		params: {
			path: {
				id
			}
		}
	})

	return result
}

export const deleteCompetitionGroupApi = async (groupId: DeleteCompetitionGroupSchema, id: string) => {
	const result = await del('/api/competition/{id}/group', {
		body: groupId,
		params: {
			path: {
				id
			}
		}
	})

	return result
}

export const addNewParticipantApi = async (userId: string, id: string) => {
	const result = await patch('/api/competition/{id}/addNewParticipant', {
		body: {
			userId
		},
		params: {
			path: {
				id
			}
		}
	})

	return result
}

export const setBreakTimeApi = async (breakTimeMinutes: number, id: string) => {
	const result = await patch('/api/competition/{id}/setCompetitionBreakTime', {
		body: {
			breakTime: {
				minutes: breakTimeMinutes
			}
		},
		params: {
			path: {
				id
			}
		}
	})

	return result
}

export const callPairPreparationApi = async (callPairPreparationData: CallPairPreparationSchema) => {
	const result = await patch('/api/competition/callPairPreparation', {
		body: callPairPreparationData
	})

	return result
}

export const defineWinnerApi = async (winnerData: DefineWinnerSchema) => {
	const result = await patch('/api/competition/defineWinner', {
		body: winnerData
	})

	return result
}

export const acceptForFightApi = async (body: AcceptPairFightBodySchema) => {
	const result = await patch('/api/competition/acceptPairFight', { body })

	return result
}

export const launchNextGroupRoundApi = async (body: LaunchNextGroupRoundApiSchema) => {
	const result = await patch('/api/competition/launchNextGroupRound', { body })

	return result
}
