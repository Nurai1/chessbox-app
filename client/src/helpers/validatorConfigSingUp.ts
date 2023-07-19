export const validatorConfigSingUp = {
	firstName: {
		isRequired: {
			errorMessage: 'First name is required'
		}
	},
	lastName: {
		isRequired: {
			errorMessage: 'Second name is required'
		}
	},
	weight: {
		isRequired: {
			errorMessage: 'Weight is required'
		},
		isNumber: {
			errorMessage: 'Weight must be a number'
		},
		maxWeight: {
			errorMessage: '199 max value'
		}
	},
	gender: {
		isRequired: {
			errorMessage: 'Gender is required'
		}
	},
	age: {
		isRequired: {
			errorMessage: 'Age is required'
		},
		isNumber: {
			errorMessage: 'Age must be a number'
		},
		maxAge: {
			errorMessage: '99 max value'
		}
	},
	fightClub: {
		isRequired: {
			errorMessage: 'Fight Club is required'
		}
	},
	country: {
		isRequired: {
			errorMessage: 'Country is required'
		}
	},
	city: {
		isRequired: {
			errorMessage: 'City is required'
		}
	},
	email: {
		isRequired: {
			errorMessage: 'Email is required'
		},
		isEmail: {
			errorMessage: 'Email incorrect'
		}
	},
	chessPlatformUserName: {
		isRequired: {
			errorMessage: '`Lichess` is required'
		}
	},
	password: {
		isRequired: {
			errorMessage: 'Password is required'
		},
		isPassword: {
			errorMessage: 'Password must contain number, letter and special character'
		},
		minLength: {
			errorMessage: 'Minimum 8 characters'
		},
		isPasswordEqual: {
			errorMessage: 'Passwords do not match'
		}
	},
	passwordConfirm: {
		isRequired: {
			errorMessage: 'Repeat Password is required'
		},
		isPassword: {
			errorMessage: 'Password must contain number, letter and special character'
		},
		minLength: {
			errorMessage: 'Minimum 8 characters'
		},
		isPasswordEqual: {
			errorMessage: 'Passwords do not match'
		}
	}
}
