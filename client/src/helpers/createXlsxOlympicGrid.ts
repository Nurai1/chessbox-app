import { OlympicGridTree } from '../types'

export const createGetMaxLeftLength = () => {
	const DepthLeftLengthByDepth: number[] = []

	const getMaxLeftLength = (depth: number) => {
		if (DepthLeftLengthByDepth[depth]) return DepthLeftLengthByDepth[depth]

		if (depth === 1 || depth === 0) {
			DepthLeftLengthByDepth[depth] = depth
			return depth
		}

		if (depth > 1) {
			const res: number = getMaxLeftLength(depth - 1) * 2 + 1
			DepthLeftLengthByDepth[depth] = res

			return res
		}

		throw new Error('Depth can not be negative')
	}

	return getMaxLeftLength
}

export const createXlsxOlympicGrid = (gridTree: OlympicGridTree & { userInfo?: string }, circlesAmount: number) => {
	const getMaxLeftLength = createGetMaxLeftLength()

	let stack: (() => void)[] = []
	const xlsxGrid: (string | undefined)[][] = []

	const currentDepthLeavesLeftByDepth: number[] = []
	const currentDepthTrees: number[] = []
	let newRow: (string | undefined)[] = []
	const countPairs = (tree: OlympicGridTree & { userInfo?: string }, thisDepth: number, canMoveDeeper: boolean) => {
		if (circlesAmount + 1 < thisDepth) return
		const currentDepthLeaves = 2 ** thisDepth
		currentDepthLeavesLeftByDepth[thisDepth] = currentDepthLeaves
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		tree.pair &&
			stack.push(
				...tree.pair.map(pairEntity => () => {
					currentDepthLeavesLeftByDepth[thisDepth] -= 1
					return countPairs(pairEntity, thisDepth + 1, currentDepthLeavesLeftByDepth[thisDepth] === 0)
				})
			)
		currentDepthTrees[thisDepth] = (currentDepthTrees[thisDepth] ?? 0) + (tree.pair ? 1 : 0)

		if (canMoveDeeper) {
			const functions = stack.slice(0, currentDepthLeaves)
			stack = stack.slice(currentDepthLeaves)
			functions.forEach(f => f())
		}
	}
	countPairs(gridTree, 1, true)

	const createXlsxGrid = (tree: OlympicGridTree & { userInfo?: string }, thisDepth: number, canMoveDeeper: boolean) => {
		if (circlesAmount + 1 < thisDepth) return
		const thisDepthLeftLength = getMaxLeftLength(circlesAmount + 1 - thisDepth)
		const biggerDepthLeftLength = getMaxLeftLength(circlesAmount + 2 - thisDepth)

		newRow.push(...Array(newRow.length > 0 ? biggerDepthLeftLength : thisDepthLeftLength).fill(''), tree.userInfo)

		if (canMoveDeeper || thisDepth === 1) {
			newRow.push(...Array(thisDepthLeftLength).fill(''))
		}

		// const currentDepthLeaves = 2 ** thisDepth
		const currentDepthLeaves = currentDepthTrees[thisDepth] * 2
		currentDepthLeavesLeftByDepth[thisDepth] = currentDepthLeaves
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		tree.pair &&
			stack.push(
				...tree.pair.map(pairEntity => () => {
					currentDepthLeavesLeftByDepth[thisDepth] -= 1
					return createXlsxGrid(pairEntity, thisDepth + 1, currentDepthLeavesLeftByDepth[thisDepth] === 0)
				})
			)

		if (canMoveDeeper) {
			const functions = stack.slice(0, currentDepthLeaves)
			stack = stack.slice(currentDepthLeaves)
			xlsxGrid.push(newRow)
			newRow = []
			functions.forEach(f => f())
		}
	}
	createXlsxGrid(gridTree, 1, true)

	const maxRowLength = getMaxLeftLength(circlesAmount + 1)
	const leftForLastRow = maxRowLength - xlsxGrid[xlsxGrid.length - 1].length
	const xlsxGridNew = [
		...xlsxGrid.slice(0, xlsxGrid.length - 1),
		[...Array(leftForLastRow).fill(''), ...xlsxGrid[xlsxGrid.length - 1]]
	]

	return xlsxGridNew
}
