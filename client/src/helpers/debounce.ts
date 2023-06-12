/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = <T extends (...args: any[]) => void>(callback: T, wait = 250) => {
	let h = 0

	const callable = (...args: any[]) => {
		clearTimeout(h)
		h = setTimeout(() => callback(...args), wait) as unknown as number
	}

	return <T>callable
}
