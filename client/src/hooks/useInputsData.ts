import { useCallback, useEffect, useState } from 'react'
import { ZodType } from 'zod'

export const useInputsData = <T, U>({ initialFields, schema }: { initialFields: T; schema: ZodType<U> }) => {
	const [inputValues, setInputValues] = useState(initialFields)
	const [inputErrors, setErrors] = useState<T>({} as T)

	useEffect(() => {
		setInputValues(initialFields)
	}, [initialFields])

	const validateInputValues = useCallback(() => {
		const parsedRes = schema.safeParse(inputValues)

		if (!parsedRes.success) {
			setErrors({} as T)
			parsedRes.error.issues.forEach(issue => {
				setErrors(errs => ({ ...errs, [issue.path[0]]: issue.message }))
			})
			return { valid: parsedRes.success, values: inputValues }
		}

		setErrors({} as T)
		return { valid: parsedRes.success, schemaValues: parsedRes.data }
	}, [inputValues, schema])

	const resetData = useCallback(() => {
		setInputValues(initialFields)
		setErrors({} as T)
	}, [initialFields])

	return { validateInputValues, inputValues, setInputValues, resetData, inputErrors, setInputsErrors: setErrors }
}
