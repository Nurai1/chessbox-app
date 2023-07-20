import { post } from 'src/api/api'
import { SignInFormServerData } from 'src/components/SignInForm/SignInForm'

export const signIn = async (signInUserData: SignInFormServerData) => {
	const result = await post('/api/login', {
		body: signInUserData
	})

	return result
}
