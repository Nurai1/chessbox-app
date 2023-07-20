import { post } from 'src/api/api'
import { SignUpFormServerData } from 'src/components/SignUpForm/SignUpForm'

export const signUp = async (signUpUserData: SignUpFormServerData) => {
	const result = await post('/api/signup', {
		body: signUpUserData
	})

	return result
}
