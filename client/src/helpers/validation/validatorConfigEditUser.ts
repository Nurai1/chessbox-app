export const validatorConfigEditUser = {
	weight: {
		isNumber: {
			errorMessage: 'Weight must be a number'
		},
		maxWeight: {
			errorMessage: '199 max value'
		}
	}
}
