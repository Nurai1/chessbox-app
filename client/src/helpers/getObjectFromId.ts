export const getObjectsFromIds = <T extends { _id?: string | undefined }>(objectsIds: string[], allObjects: T[]) => {
	return allObjects.filter(obj => obj?._id && objectsIds.includes(obj._id))
}
