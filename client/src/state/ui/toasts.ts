import { atom } from 'jotai'

type Toast = {
	id: number
	message: string
	type: 'error'
}
export const toastsAtom = atom<Toast[]>([])

export const setErrorToastWriteAtom = atom(null, (_, set, { message }: { message: string }) => {
	set(toastsAtom, t => [
		...t,
		{
			id: window.crypto.getRandomValues(new Uint32Array(1))[0],
			message,
			type: 'error'
		}
	])
})
