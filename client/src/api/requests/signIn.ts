import { post, patch } from 'src/api/api'
import { ChangePasswordDataSchema, ForgotPasswordDataSchema, SignInDataSchema } from 'src/types'

export const signIn = async (signInUserData: SignInDataSchema) => {
	const result = await post('/api/login', {
		body: signInUserData
	})

	return result
}

export const changePasswordRequest = async (body: ChangePasswordDataSchema) => {
	const result = await patch('/api/user/changePassword', {
		body
	})

	return result
}

export const forgotPasswordRequest = async (body: ForgotPasswordDataSchema) => {
	const result = await post('/api/user/forgotPassword', {
		body
	})

	return result
}
