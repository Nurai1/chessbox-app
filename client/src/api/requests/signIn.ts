import { post } from 'src/api/api'
import { SignInDataSchema } from 'src/types'

export const signIn = async (signInUserData: SignInDataSchema) => {
	const result = await post('/api/login', {
		body: signInUserData
	})

	return result
}
