import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'

export const useValidatorConfigSingUp = () => {
	const { t } = useOptionalTranslation()

	const validatorConfigSingUp = {
		firstName: {
			isRequired: {
				errorMessage: t('required')
			},
			latinLettersAllowed: {
				errorMessage: t('latinLettersAllowed')
			}
		},
		lastName: {
			isRequired: {
				errorMessage: t('required')
			},
			latinLettersAllowed: {
				errorMessage: t('latinLettersAllowed')
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
		gender: {
			isRequired: {
				errorMessage: t('required')
			}
		},
		birthDate: {
			isRequired: {
				errorMessage: t('required')
			},
			isDateValid: {
				errorMessage: t('isDateValid')
			},
			isFuture: {
				errorMessage: t('isFuture')
			},
			maxAge: {
				errorMessage: t('maxAge')
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
		email: {
			isRequired: {
				errorMessage: t('required')
			},
			isEmail: {
				errorMessage: t('incorrect')
			}
		},
		chessPlatformUserName: {
			isRequired: {
				errorMessage: t('required')
			}
		},
		password: {
			isRequired: {
				errorMessage: t('required')
			},
			isPassword: {
				errorMessage: t('isPassword')
			},
			minLength: {
				errorMessage: t('minLength')
			},
			isPasswordEqual: {
				errorMessage: t('isPasswordEqual')
			}
		},
		passwordConfirm: {
			isRequired: {
				errorMessage: t('required')
			},
			isPassword: {
				errorMessage: t('isPassword')
			},
			minLength: {
				errorMessage: t('minLength')
			},
			isPasswordEqual: {
				errorMessage: t('isPasswordEqual')
			}
		}
	}

	return validatorConfigSingUp
}
