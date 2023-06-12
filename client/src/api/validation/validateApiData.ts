import { RequestResponse } from 'api/apiRequest'
import { RequestResponseValidationError } from 'helpers/errors'
import { ZodType } from 'zod'

export const validateApiData = <T>(data: RequestResponse, Parser: ZodType): RequestResponse<T> => {
	if (data.error) {
		return data as RequestResponse<T>
	}

	const parseInfo = Parser.safeParse(data.data)

	if (parseInfo.success) {
		return data as RequestResponse<T>
	}

	return {
		data: data.data as T,
		error: new RequestResponseValidationError({
			message: parseInfo.error.message
		})
	}
}
