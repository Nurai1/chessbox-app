import { components } from './generated'

export type { User } from './user'
export type { Competition } from './competition'

export type UserSchema = components['schemas']['User']
export type CompetitionSchema = components['schemas']['Competition']
export type CompetitionGroupSchema = components['schemas']['CompetitionGroup']
export type PairSchema = components['schemas']['Pair']
