import { validatorConfigSingUp } from 'src/helpers/validation/validatorConfigSingUp'

export const validatorConfigChangePassword = {
	newPassword: validatorConfigSingUp.password,
	passwordConfirm: validatorConfigSingUp.passwordConfirm
}
