import createClient from 'openapi-fetch'
import { paths } from 'src/types/generated'
import { getToken } from 'src/helpers/tokenLocalStorage'
import configEnv from 'src/configEnv'

export const { get, post, patch, del } = createClient<paths>({
	baseUrl: configEnv.serviceApiUrl,
	headers: {
		'x-access-token': getToken()
	}
})
