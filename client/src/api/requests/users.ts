import { get } from 'src/api/api'

export const getUsersApi = async (query: {
	limit?: number
	offset?: number
	search?: string
	ageFrom?: number
	ageTo?: number
	weightFrom?: number
	weightTo?: number
	withWomen?: boolean
	withMen?: boolean
}) => {
	const result = await get('/api/users', {
		params: {
			query: {
				limit: query.limit,
				offset: query.offset,
				search: query.search,
				ageFrom: query.ageFrom,
				ageTo: query.ageTo,
				weightFrom: query.weightFrom,
				weightTo: query.weightTo,
				withWomen: query.withWomen,
				withMen: query.withMen
			}
		}
	})

	return result
}

export const getUserByIdApi = async (id: string) => {
	const result = await get('/api/user/{id}', {
		params: {
			path: {
				id
			}
		}
	})

	return result
}

export const getCurrentUser = async () => {
	const result = await get('/api/user/getCurrentUser', {})

	return result
}
