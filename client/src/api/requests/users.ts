import { get } from 'src/api/api'

export const getUsersApi = async (query: { limit?: number; offset?: number }) => {
	const result = await get('/api/users', {
		params: {
			query: {
				limit: `${query.limit}`,
				offset: `${query.offset}`
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
