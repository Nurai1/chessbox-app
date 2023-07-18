/* eslint-disable guard-for-in, no-restricted-syntax */
import { EMAIL_REGEX, PASSWORD_REGEX, DIGIT_REGEX } from 'src/helpers/formValidators'

type ValidationConfigType =
    Record<string,
        Record<string,
            Record<string, string>
        >
    >

export const validator = (fieldData: Record<string, string>, validationConfig: ValidationConfigType) => {
    const errors: Record<string, string>  = {}

    const validate = (validateMethod: string, validationData: string, config: Record<string, string> ) => {
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
            case 'isNumber':
                if (!DIGIT_REGEX.test(validationData)) {
                    return config.errorMessage
                }
                break
            case 'maxWeight':
                if (Number(validationData) > 199) {
                    return config.errorMessage
                }
                break
            case 'maxAge':
                if (Number(validationData) > 99) {
                    return config.errorMessage
                }
                break
            default:
                break
        }

        return null
    };

    for (const fieldName in fieldData) {
        for (const validateMethod in validationConfig[fieldName]) {
            const error = validate(validateMethod, fieldData[fieldName], validationConfig[fieldName][validateMethod])

            if (error) {
                errors[fieldName] = error
                break
            }
        }
    }

    return errors
}
