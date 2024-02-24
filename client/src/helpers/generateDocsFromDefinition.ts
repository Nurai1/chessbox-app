import { ColInfo } from 'xlsx'

interface GeneratedFileLikeData {
	downloadFile: (filename: string) => void
	data: unknown
}

export const generateXlsx = async (
	// xlsxWorksheetData: Record<T, string>[],
	xlsxWorksheetData: (string | undefined)[][],
	options?: { columns?: ColInfo[] }
): Promise<GeneratedFileLikeData> => {
	const { writeFileXLSX, utils } = await import('xlsx')

	const worksheet = utils.json_to_sheet(xlsxWorksheetData)

	worksheet['!cols'] = options?.columns
	const workbook = utils.book_new()
	utils.book_append_sheet(workbook, worksheet, 'Шахбокс')

	return {
		data: workbook,
		downloadFile: (filename: string) => {
			writeFileXLSX(workbook, filename)
		}
	}
}
