import { t } from 'i18next'

export const useValidatorConfigEditUser = () => {
	const validatorConfigEditUser = {
		firstName: {
			isRequired: {
				errorMessage: t('required')
			}
		},
		lastName: {
			isRequired: {
				errorMessage: t('required')
			}
		},
		weight: {
			isRequired: {
				errorMessage: t('required')
			},
			isNumber: {
				errorMessage: t('isNumber')
			},
			maxWeight: {
				errorMessage: t('maxWeight')
			}
		},
		fightClub: {
			isRequired: {
				errorMessage: t('required')
			}
		},
		country: {
			isRequired: {
				errorMessage: t('required')
			}
		},
		city: {
			isRequired: {
				errorMessage: t('required')
			}
		},
		chessPlatformUserName: {
			isRequired: {
				errorMessage: t('required')
			}
		}
	}
	return validatorConfigEditUser
}
