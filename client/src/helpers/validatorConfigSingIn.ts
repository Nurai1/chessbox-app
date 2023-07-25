export const validatorConfigSingIn = {
	email: {
		isRequired: {
			errorMessage: 'Email is required'
		},
		isEmail: {
			errorMessage: 'Email incorrect'
		}
	},
	password: {
		isRequired: {
			errorMessage: 'Password is required'
		}
	}
}
