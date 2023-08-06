import { pick } from 'remeda'
import { validatorConfigSingIn } from './validatorConfigSingIn'

export const validatorConfigForgotPassword = pick(validatorConfigSingIn, ['email'])
