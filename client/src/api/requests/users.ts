import { apiRequest } from 'api/apiRequest'
import { UserType } from 'api/generatedTypes/users'
import { UsersParser } from 'api/validation/users'
import { validateApiData } from 'api/validation/validateApiData'

const getUsersRequest = async () => {
	return apiRequest({ pathname: '/users' })
}

export const getUsersData = async () => {
	const raw = await getUsersRequest()
	const usersData = validateApiData<UserType[]>(raw, UsersParser)

	return usersData
}
