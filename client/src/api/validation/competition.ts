import { z } from 'zod'

export const CompetitionGroupParser = z.object({
	_id: z.string(),
	startDate: z.string().datetime(),
	endDate: z.string().datetime(),
	name: z.string(),
	description: z.string(),
	groups: z.string(),
	participants: z.string()
})

export const PairParser = z.object({
	_id: z.string(),
	roundNumber: z.number(),
	blackParticipant: z.string(),
	whiteParticipant: z.string(),
	winner: z.string(),
	passed: z.boolean()
})

export const CompetitionParser = z.object({
	_id: z.string(),
	startDate: z.string().datetime(),
	endDate: z.string().datetime(),
	name: z.string(),
	description: z.string(),
	groups: z.array(CompetitionGroupParser),
	participants: z.array(PairParser)
})

export const CompetitionsParser = z.array(CompetitionParser)
