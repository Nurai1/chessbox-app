export const validatorConfigEditUser = {
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
	chessPlatformUserName: {
		isRequired: {
			errorMessage: '`Lichess` is required'
		}
	}
}
