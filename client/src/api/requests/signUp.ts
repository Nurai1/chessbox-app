import { patchRaw, post } from 'src/api/api'
import { ConfirmEmailDataSchema, SignUpDataSchema } from 'src/types'

export const signUp = async (signUpUserData: SignUpDataSchema) => {
	const result = await post('/api/signup', {
		body: signUpUserData
	})

	return result
}

export const confirmEmailApi = async (signUpUserData: ConfirmEmailDataSchema) => {
	// The email link must work without a session, including with an expired saved token.
	const result = await patchRaw('/api/user/confirmEmail', {
		body: signUpUserData
	})

	return result
}
