import { pick } from 'remeda'
import { validatorConfigSingIn } from 'src/helpers/validation/validatorConfigSingIn'

export const validatorConfigForgotPassword = pick(validatorConfigSingIn, ['email'])
