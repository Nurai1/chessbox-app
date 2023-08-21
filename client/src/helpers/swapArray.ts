export const swapArray = <T>(items:T[], firstIndex: number, secondIndex: number) => {
    const results= items.slice()
    const firstItem = items[firstIndex]
    results[firstIndex] = items[secondIndex]
    results[secondIndex] = firstItem

    return results
}
