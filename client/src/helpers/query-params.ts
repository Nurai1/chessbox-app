import configEnv from 'configEnv'

const DEFAULT_SERVER_URL = configEnv.serviceApiUrl

export interface QueryParam {
	key: string
	value?: string
}

export const getUrlWithOptionalParams = ({
	origin = DEFAULT_SERVER_URL,
	pathname = '',
	params
}: {
	origin?: string
	pathname?: string
	params: QueryParam[]
}) => {
	const originUrl = new URL(origin + pathname)
	params.forEach(p => p.value !== undefined && originUrl.searchParams.set(p.key, p.value))
	return originUrl.toString()
}

export const getUrlWithParams = ({
	origin = DEFAULT_SERVER_URL,
	pathname = '',
	params
}: {
	origin?: string
	pathname?: string
	params: Required<QueryParam>[]
}) => {
	const originUrl = new URL(origin + pathname)
	params.forEach(p => originUrl.searchParams.set(p.key, p.value))
	return originUrl.toString()
}

export const getQueryParam = (key: string) => {
	const normalizedSearch = window.location.search.replace('/', '')
	const params = new URLSearchParams(normalizedSearch)
	const param = params.get(key)
	return param || undefined
}

export const getDecodedQueryParam = (key: string) => {
	const param = getQueryParam(key)
	return param ? decodeURIComponent(param) : undefined
}

export const getUrlWithBase64ObjectParam = <T>({
	origin = DEFAULT_SERVER_URL,
	pathname = '',
	param
}: {
	origin?: string
	pathname?: string
	param: { key: string; value: T }
}) => {
	const encodedValue = btoa(JSON.stringify(param.value))
	const originUrl = new URL(origin + pathname)
	originUrl.searchParams.set(param.key, encodedValue)
	return originUrl.toString()
}

export const getBase64ObjectQueryParam = <T>(key: string) => {
	const param = getQueryParam(key)

	if (param) {
		return JSON.parse(atob(param)) as T
	}
	return undefined
}
