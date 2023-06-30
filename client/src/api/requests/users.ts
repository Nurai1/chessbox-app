import { get } from 'src/api/api'

export const getUsersApi = async (query: {limit?: string, offset?: string}) => {
	const result = await get('/api/users', {
		params: {
			query
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
