import { useValidatorConfigSingUp } from 'src/helpers/validation/validatorConfigSingUp'

export const useValidatorConfigChangePassword = () => {
	const validatorConfigSingUp = useValidatorConfigSingUp()
	return {
		newPassword: validatorConfigSingUp.password,
		passwordConfirm: validatorConfigSingUp.passwordConfirm
	}
}
