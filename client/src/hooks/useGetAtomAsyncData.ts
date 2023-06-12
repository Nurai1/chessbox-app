import { RequestResponse } from 'api/apiRequest'
import { Atom, PrimitiveAtom, useAtomValue } from 'jotai'
import { AtomWithDefaultType } from 'state/types'
import { useHandleRequestError } from './useHandleRequestError'

export const useGetAtomAsyncData = <T>(
	asyncAtom:
		| AtomWithDefaultType<RequestResponse<T> | Promise<RequestResponse<T>>, RequestResponse<T>>
		| PrimitiveAtom<Promise<RequestResponse<T>> | RequestResponse<T>>
		| Atom<Promise<RequestResponse<T>> | RequestResponse<T>>
) => {
	const data = useAtomValue(asyncAtom)
	useHandleRequestError(data.error)

	return data
}
