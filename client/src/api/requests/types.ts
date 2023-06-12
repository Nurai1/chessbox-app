export type GetTransferObjectsFilter = { archived: boolean; searchParam?: string }
export type GetTransferObjectsParams = {
	offset: number
	limit: number
	filter: GetTransferObjectsFilter
}
