import { get } from 'src/api/api'

export const getUserCurrentPairApi = async (id: string, competitionId: string) => {
	const result = await get('/api/user/{id}/nearestPair/{competitionId}', {
		params: {
			path: {
				id,
				competitionId
			}
		}
	})

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
