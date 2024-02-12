import { CompetitionSchema } from '../types'

export const getPriceText = (competition: CompetitionSchema) => {
	return `Price: ${competition.price?.currentValue} ₽${competition.price?.valueForMembers ? ` / Members: ${competition.price?.valueForMembers} ₽` : ''}`
}
