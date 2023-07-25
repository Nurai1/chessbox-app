import { components, paths } from './generated'

export type UserSchema = components['schemas']['User']
export type CompetitionSchema = components['schemas']['Competition']
export type CompetitionGroupSchema = components['schemas']['CompetitionGroup']
export type PairSchema = components['schemas']['Pair']
export type SignUpDataSchema = paths['/api/signup']['post']['requestBody']['content']['application/json']
export type SignInDataSchema = paths['/api/login']['post']['requestBody']['content']['application/json']
