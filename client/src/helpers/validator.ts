/* eslint-disable guard-for-in, no-restricted-syntax */
import { EMAIL_REGEX, PASSWORD_REGEX, DIGIT_REGEX } from 'src/helpers/formValidators'

type ValidationConfigType =
    Record<string,
        Record<string,
            Record<string, string>
        >
    >

export const validator = (fieldData: Record<string, string>, validationConfig: ValidationConfigType) => {
    const errors: Record<string, Record<string, string>>  = {}

    for (const fieldName in fieldData) {
        for (const validateMethod in validationConfig[fieldName]) {
            switch (validateMethod) {
                case 'isRequired':
                    if (fieldData[fieldName].trim() === '') {
                        errors[fieldName] = validationConfig[fieldName][validateMethod]
                    }
                    break
                case 'isEmail':
                    if (!EMAIL_REGEX.test(fieldData[fieldName])) {
                        errors[fieldName] = validationConfig[fieldName][validateMethod]
                    }
                    break
                case 'isPassword':
                    if (!PASSWORD_REGEX.test(fieldData[fieldName])) {
                        errors[fieldName] = validationConfig[fieldName][validateMethod]
                    }
                    break
                case 'minLength':
                    if (fieldData[fieldName].trim().length < 8) {
                        errors[fieldName] = validationConfig[fieldName][validateMethod]
                    }
                    break
                case 'isNumber':
                    if (!DIGIT_REGEX.test(fieldData[fieldName])) {
                        errors[fieldName] = validationConfig[fieldName][validateMethod]
                    }
                    break
                case 'maxWeight':
                    if (Number(fieldData[fieldName]) > 199) {
                        errors[fieldName] = validationConfig[fieldName][validateMethod]
                    }
                    break
                case 'maxAge':
                    if (Number(fieldData[fieldName]) > 99) {
                        errors[fieldName] = validationConfig[fieldName][validateMethod]
                    }
                    break
                default:
                    break
            }
        }
    }

    return errors
}
