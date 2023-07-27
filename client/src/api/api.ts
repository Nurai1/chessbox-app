import createClient from 'openapi-fetch'
import { paths } from 'src/types/generated'
import { getToken } from 'src/helpers/tokenLocalStorage'

export const { get, post, patch } = createClient<paths>({
	baseUrl: 'http://localhost:3001',
	headers: {
		'x-access-token': getToken()
	}
})
