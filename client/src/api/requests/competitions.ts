import { get, patch, post, del } from 'src/api/api'
import {
	SetCompetitionJudgesSchema,
	SetJudgesToPairsSchema,
	CompetitionGroupsOrdersSchema,
	CompetitionGroupSchema,
	DeleteCompetitionGroupSchema,
	AddNewParticipantSchema
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

export const addNewParticipantApi = async (userId: AddNewParticipantSchema, id: string) => {
	const result = await patch('/api/competition/{id}/addNewParticipant', {
		body: userId,
		params: {
			path: {
				id
			}
		}
	})

	return result
}
