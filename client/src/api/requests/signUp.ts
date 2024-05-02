import { patch, post } from 'src/api/api'
import { ConfirmEmailDataSchema, SignUpDataSchema } from 'src/types'

export const signUp = async (signUpUserData: SignUpDataSchema) => {
	const result = await post('/api/signup', {
		body: signUpUserData
	})

	return result
}

export const confirmEmailApi = async (signUpUserData: ConfirmEmailDataSchema) => {
	const result = await patch('/api/user/confirmEmail', {
		body: signUpUserData
	})

	return result
}
