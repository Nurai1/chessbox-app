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
        isNumber: {
            errorMessage: 'Weight must be a number'
        },
        maxWeight: {
            errorMessage: "199 max value"
        },
        isRequired: {
            errorMessage: 'Weight is required'
        }
    },
    gender: {
        isRequired: {
            errorMessage: 'Gender is required'
        }
    },
    age: {
        isNumber: {
            errorMessage: 'Age must be a number'
        },
        maxAge: {
            errorMessage: "99 max value"
        },
        isRequired: {
            errorMessage: 'Age is required'
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
        isPassword: {
            errorMessage: 'Password must contain number, letter and special character'
        },
        minLength: {
            errorMessage: 'Minimum 8 characters'
        },
        isEqual: {
            errorMessage: 'Passwords do not match'
        }
    },
    passwordConfirm: {
        isPassword: {
            errorMessage: 'Password must contain number, letter and special character'
        },
        minLength: {
            errorMessage: 'Minimum 8 characters'
        },
        isEqual: {
            errorMessage: 'Passwords do not match'
        }
    },
}