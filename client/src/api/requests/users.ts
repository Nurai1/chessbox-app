import { get, patch } from 'src/api/api'
import { GetUsersParams, UserSchema } from 'src/types'

export const getUsersApi = async (query: GetUsersParams = {}) => {
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

export const getCurrentUser = async () => {
	const result = await get('/api/user/getCurrentUser', {})

	return result
}

export const editCurrentUser = async (userData: UserSchema) => {
	const result = await patch('/api/user/currentUser', {
		body: userData
	})

	return result
}

export const getAllJudges = async () => {
	const result = await get('/api/allJudges', {})

	return result
}
