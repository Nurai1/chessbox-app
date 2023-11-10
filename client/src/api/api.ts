import createClient from 'openapi-fetch'
import { paths } from 'src/types/generated'
import { getToken } from 'src/helpers/tokenLocalStorage'
import configEnv from 'src/configEnv'

export const {
	get: getRaw,
	post: postRaw,
	patch: patchRaw,
	del: delRaw
} = createClient<paths>({
	baseUrl: configEnv.serviceApiUrl
})

export const get: typeof getRaw = async (path, options) => {
	const result = await getRaw(path, {
		...options,
		headers: { 'x-access-token': getToken() }
	})

	return result
}

export const post: typeof postRaw = async (path, options) => {
	const result = await postRaw(path, {
		...options,
		headers: { 'x-access-token': getToken() }
	})

	return result
}

export const patch: typeof patchRaw = async (path, options) => {
	const result = await patchRaw(path, {
		...options,
		headers: { 'x-access-token': getToken() }
	})

	return result
}

export const del: typeof delRaw = async (path, options) => {
	const result = await delRaw(path, {
		...options,
		headers: { 'x-access-token': getToken() }
	})

	return result
}
