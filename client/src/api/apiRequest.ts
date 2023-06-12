import configEnv from 'configEnv'
import { ClientError, ClientRequestError, InternalServerError, IRequestResponseError } from 'helpers/errors'

export type RequestResponse<T = unknown> = {
	data?: T
	error?: IRequestResponseError
}

type ApiRequestConfig<T> = {
	requestConfig?: Omit<RequestInit, 'body'> & { body?: T }
	onlyCheckSuccess?: boolean
}
type ApiRequestParams<T> = (
	| {
			url: RequestInfo | URL
			pathname?: string
	  }
	| {
			url?: RequestInfo | URL
			pathname: string
	  }
) &
	ApiRequestConfig<T>

export const apiRequest = async <T>({
	url = configEnv.serviceApiUrl,
	pathname = '',
	requestConfig = {},
	onlyCheckSuccess = false
}: ApiRequestParams<T>): Promise<RequestResponse> => {
	let response

	// const authJWTToken = sessionStorage.getItem(AUTH_JWT_TOKEN_KEY)

	// if (!authJWTToken) {
	// 	return {
	// 		error: new ClientError({
	// 			message: `No auth token was provided.`
	// 		})
	// 	}
	// }

	try {
		response = await fetch(url + pathname, {
			...requestConfig,
			headers: {
				Accept: 'application/json',
				// Authorization: `Bearer ${authJWTToken}`,
				...requestConfig.headers
			},
			body: JSON.stringify(requestConfig.body)
		})

		if (response.status === 400) {
			const data = await response.json()
			return {
				error: new ClientRequestError({
					message: data.messageForUser
				})
			}
		}

		if (response.status === 500) {
			return {
				error: new InternalServerError({})
			}
		}

		if (response.status === 200) {
			if (onlyCheckSuccess) {
				return {
					data: {
						success: true
					}
				} as RequestResponse<{
					success: true
				}>
			}

			const data = await response.json()

			return {
				data
			}
		}
	} catch (err) {
		return {
			error: new ClientError({
				message: (err as Error).message
			})
		}
	}

	return {
		error: new ClientError({
			message: `Response status ${response.status} of ${url + pathname} wasn't handled.`
		})
	}
}

export const apiRequestOnlyCheckSuccess = async <T>(data: ApiRequestParams<T>) => {
	return apiRequest({ ...data, onlyCheckSuccess: true }) as RequestResponse<{ success: true }>
}
