import { z } from 'zod'

export const nonEmptyStringValidator = z
	.string({ required_error: 'This field is required.' })
	.min(1, { message: 'This field is required.' })
export const nonEmptyMultipleOptionsValidator = z.string().array().nonempty({ message: 'This field is required.' })
export const moreThanStringValidator = (value: number) =>
	nonEmptyStringValidator.min(value, { message: `Length should be equal or more than ${value}.` })

export const dateTimeStringValidator = nonEmptyStringValidator.datetime()
export const emailStringValidator = nonEmptyStringValidator.email()

const URL_REGEX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/m
export const invalidUrlStringValidator = z.custom<string>(val => URL_REGEX.test(val as string), 'Invalid url')

export const EMAIL_REGEX = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*\d)(?=.*[^\da-zA-Z]).{3,}$/
export const DIGIT_REGEX = /^[0-9]*$/
