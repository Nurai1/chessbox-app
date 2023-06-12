import { z } from 'zod'

export const UserParser = z.object({
	_id: z.string(),
	role: z.string(),
	email: z.string(),
	username: z.string(),
	ratingNumber: z.number(),
	age: z.number(),
	gender: z.string(),
	currentGroupId: z.string()
})

export const UsersParser = z.array(UserParser)
