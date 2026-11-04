import { get, post } from 'src/api/api'
import { SignUpDataSchema } from 'src/types'

export const getCoachParticipantsApi = () => get('/api/coach/participants', {})

export const createCoachParticipantApi = (body: SignUpDataSchema) => post('/api/coach/participants', { body })
