/* eslint-disable guard-for-in, no-restricted-syntax */
import {
	EMAIL_REGEX,
	PASSWORD_REGEX,
	DIGIT_REGEX,
	DATE_REGEX,
	IS_ASCII_REGEX
} from 'src/helpers/validation/formValidators'
import { isFuture, max99years } from '../datetime'

type ValidationConfigType = Record<string, Record<string, Record<string, string>>>

export const validate = (
	validateMethod: string,
	data: { value: string; passwords?: [string?, string?] },
	config: Record<string, string>
) => {
	const validationData = data.value
	const { passwords } = data

	switch (validateMethod) {
		case 'isRequired':
			if (validationData.trim() === '') {
				return config.errorMessage
			}
			break
		case 'isEmail':
			if (!EMAIL_REGEX.test(validationData)) {
				return config.errorMessage
			}
			break
		case 'isPassword':
			if (!PASSWORD_REGEX.test(validationData)) {
				return config.errorMessage
			}
			break
		case 'minLength':
			if (validationData.trim().length < 8) {
				return config.errorMessage
			}
			break
		case 'latinLettersAllowed':
			if (!IS_ASCII_REGEX.test(validationData)) {
				return config.errorMessage
			}
			break
		case 'isPasswordEqual':
			if (!passwords) {
				break
			}

			if (passwords.length !== 2) {
				passwords.push(validationData)
			}
			if (passwords.length === 2 && passwords[0] !== passwords[1]) {
				return config.errorMessage
			}
			break
		case 'isNumber':
			if (!DIGIT_REGEX.test(validationData.trim())) {
				return config.errorMessage
			}
			break
		case 'maxWeight':
			if (Number(validationData) > 199) {
				return config.errorMessage
			}
			break
		case 'maxAge':
			if (max99years(validationData)) {
				return config.errorMessage
			}
			break
		case 'isDateValid':
			if (!DATE_REGEX.test(validationData.trim())) {
				return config.errorMessage
			}
			break
		case 'isFuture':
			if (isFuture(validationData.trim())) {
				return config.errorMessage
			}
			break
		default:
			break
	}

	return null
}

export const validator = (fieldData: Record<string, string>, validationConfig: ValidationConfigType) => {
	const errors: Record<string, string> = {}
	const passwords: [string?, string?] = []

	for (const fieldName in fieldData) {
		for (const validateMethod in validationConfig[fieldName]) {
			const error = validate(
				validateMethod,
				{ value: fieldData[fieldName], passwords },
				validationConfig[fieldName][validateMethod]
			)

			if (error) {
				errors[fieldName] = error
				break
			}
		}
	}

	return errors
}
