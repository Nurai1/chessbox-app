import { get } from 'src/api/api'

export const getCompetitionsApi = async () => {
	const result = await get('/api/competitions', {})

	return result
}
