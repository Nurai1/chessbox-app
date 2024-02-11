/* eslint-disable no-console */
import { clone } from 'remeda'
import { CompetitionGroupSchema, OlympicGridTree, ParticipantSchema } from '../types'
import { createXlsxOlympicGrid } from './createXlsxOlympicGrid'

const getFirstRowOfGroup = (group?: CompetitionGroupSchema) => {
	if (!group) return []
	return [
		`Шахбокс, ${group.gender}`,
		`${group.ageCategory?.from} - ${group.ageCategory?.to} лет,`,
		`${group.weightCategory?.from} - ${group.weightCategory?.to} кг`
	]
}

export const getXlsxRowsForGroup = (
	group: CompetitionGroupSchema | undefined,
	participants: ParticipantSchema[] | null
) => {
	let depth = 0

	const fillWithUserAndCountDepth = (tree: OlympicGridTree & { userInfo?: string }, currentDepth: number) => {
		if (currentDepth > depth) depth = currentDepth

		const user = participants ? participants.find(participant => participant._id === tree.userId) : undefined
		if (user) tree.userInfo = `${user?.fullName}, ${user?.address?.city}`

		tree.pair?.forEach(pairEnt => fillWithUserAndCountDepth(pairEnt, currentDepth + 1))

		return tree
	}

	try {
		const olympicGrid = group?.olympicGrid as OlympicGridTree
		const newOlympicGrid = fillWithUserAndCountDepth(clone(olympicGrid), 0)
		const xlsxRows: (string | undefined)[][] = createXlsxOlympicGrid(newOlympicGrid, depth)

		const xlsxColumns = xlsxRows.reduce(
			(acc, row) => {
				for (let i = 0; i < row.length; i += 1) {
					if (!acc[i]) {
						acc[i] = []
					}
					acc[i].push(row[i])
				}

				return acc
			},
			[] as (string | undefined)[][]
		)

		const reversedXlsx = xlsxColumns.map(item => [...item].reverse())
		reversedXlsx.unshift(getFirstRowOfGroup(group))
		reversedXlsx.push([''])

		return reversedXlsx
	} catch (e) {
		console.log('Error while xlsx compounded')
		console.error(e)
		return []
	}
}
