import { UserParser } from 'api/validation/users'
import { z } from 'zod'

export type UserType = z.infer<typeof UserParser>
export type UserIdType = UserType['_id']
