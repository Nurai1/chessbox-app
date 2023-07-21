import { post } from 'src/api/api'
import { SignUpDataSchema } from 'src/types'

export const signUp = async (signUpUserData: SignUpDataSchema) => {
	const result = await post('/api/signup', {
		body: signUpUserData
	})

	return result
}
