import { IRequestResponseError } from 'helpers/errors'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { setErrorToastWriteAtom } from 'state/ui/toasts'

export const useHandleRequestError = (error: IRequestResponseError | null | undefined) => {
	const setErrorToast = useSetAtom(setErrorToastWriteAtom)

	useEffect(() => {
		if (error) {
			setErrorToast({ message: `Message: ${error.message}.` })
		}
	}, [error, setErrorToast])
}
