import { get, post } from 'src/api/api'
import { SignUpDataSchema } from 'src/types'

export const getCoachParticipantsApi = (search = '', offset = 0) =>
	get('/api/coach/participants', { params: { query: { search, offset } } })

export const createCoachParticipantApi = (body: SignUpDataSchema) => post('/api/coach/participants', { body })
