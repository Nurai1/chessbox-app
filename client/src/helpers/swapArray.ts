export const swapArray = <T>(items: T[], firstIndex: number, secondIndex: number) => {
	const results = [...items]
	results.splice(firstIndex, 1)

	results.splice(secondIndex, 0, items[firstIndex])

	return results
}
