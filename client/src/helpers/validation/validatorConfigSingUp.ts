export const validatorConfigSingUp = {
	firstName: {
		isRequired: {
			errorMessage: 'First name is required'
		},
		latinLettersAllowed: {
			errorMessage: 'Only latin letters are allowed'
		}
	},
	lastName: {
		isRequired: {
			errorMessage: 'Last name is required'
		},
		latinLettersAllowed: {
			errorMessage: 'Only latin letters are allowed'
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
	birthDate: {
		isRequired: {
			errorMessage: 'Birthday is required'
		},
		isDateValid: {
			errorMessage: 'Enter correct date in DD.MM.YYYY. For example 10.07.1999'
		},
		isFuture: {
			errorMessage: "Birthday can't be future"
		},
		maxAge: {
			errorMessage: '99 max age'
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
