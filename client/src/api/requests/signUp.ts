import { post } from 'src/api/api'
import { SignUpFormServerData } from 'src/routes/SignUpPage'

export const signUp = async (signUpUserData: SignUpFormServerData) => {
    const result = await post('/api/signup', {
        body: signUpUserData
    })

    return result
}
