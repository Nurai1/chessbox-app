import { RequestResponse } from 'api/apiRequest'
import { atom, Getter, PrimitiveAtom } from 'jotai'
import { AtomFamily } from 'jotai/vanilla/utils/atomFamily'

export function atomWithRefresh<T>(fn: (get: Getter) => T) {
	const refreshCounter = atom(0)

	return atom(
		get => {
			get(refreshCounter)
			return fn(get)
		},
		(_, set) => set(refreshCounter, i => i + 1)
	)
}

export const getResponseByPreviousCutSearchParam = async <
	T extends { filter: { searchParam?: string } },
	U extends { items: unknown[]; total: number }
>({
	params,
	asyncAtomFamily,
	get
}: {
	asyncAtomFamily: AtomFamily<T, PrimitiveAtom<RequestResponse<U> | Promise<RequestResponse<U>>>>
	params: T
	get: Getter
}): Promise<{ isPreviousResEmpty: true; res: { data: U } } | { isPreviousResEmpty: false; res: null }> => {
	const previousSearchParam = params.filter.searchParam?.slice(0, -1)
	const previousRes: RequestResponse<U> | null = previousSearchParam
		? await get(
				asyncAtomFamily({
					...params,
					filter: { ...params.filter, searchParam: previousSearchParam }
				})
		  )
		: null

	if (previousRes?.data?.items?.length === 0) {
		return { isPreviousResEmpty: true, res: { data: { ...previousRes.data, items: [] } } }
	}

	return { isPreviousResEmpty: false, res: null }
}

export const clearAllCacheFromAtomFamily = <T, U>(atomFamily: AtomFamily<T, U>) => {
	atomFamily.setShouldRemove(() => true)
	atomFamily.setShouldRemove(null)
}
