import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'

export const useValidatorConfigSingIn = () => {
	const { t } = useOptionalTranslation()

	const validatorConfigSingIn = {
		email: {
			isRequired: {
				errorMessage: t('required')
			},
			isEmail: {
				errorMessage: t('incorrect')
			}
		},
		password: {
			isRequired: {
				errorMessage: t('required')
			}
		}
	}

	return validatorConfigSingIn
}
