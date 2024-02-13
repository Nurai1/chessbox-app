import { CompetitionSchema } from '../types'

export const getPriceText = (competition: CompetitionSchema) => {
	return `Start fee: ${competition.price?.currentValue} ₽${competition.price?.valueForMembers ? ` / Members: ${competition.price?.valueForMembers} ₽` : ''}`
}
