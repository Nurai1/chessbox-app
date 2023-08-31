import { components, paths } from './generated'

export type UserSchema = components['schemas']['User']
export type CompetitionSchema = components['schemas']['Competition']
export type CompetitionGroupSchema = components['schemas']['CompetitionGroup']
export type PairSchema = components['schemas']['Pair']
export type CompetitionRequirementsSchema = components['schemas']['Competition']['requirements']
export type SignUpDataSchema = paths['/api/signup']['post']['requestBody']['content']['application/json']
export type SignInDataSchema = paths['/api/login']['post']['requestBody']['content']['application/json']
export type ChangePasswordDataSchema =
	paths['/api/user/changePassword']['patch']['requestBody']['content']['application/json']
export type ForgotPasswordDataSchema =
	paths['/api/user/forgotPassword']['post']['requestBody']['content']['application/json']
export type SetCompetitionJudgesSchema =
	paths['/api/competition/setJudgesToCompetition']['patch']['requestBody']['content']['application/json']
export type SetJudgesToPairsSchema =
	paths['/api/competition/setJudgesToPairs']['patch']['requestBody']['content']['application/json']
export type CompetitionGroupsOrdersSchema =
	paths['/api/competition/{id}/setCompetitionGroupsOrders']['patch']['requestBody']['content']['application/json']
export type CompetitionGroupsOrders =
	paths['/api/competition/{id}/setCompetitionGroupsOrders']['patch']['requestBody']['content']['application/json']['orders']

export type ErrorPayload = { errorMessage: string; response: Response }
export type CompetitionSchemaJudge = Omit<CompetitionSchema, 'judges'> & {
	judges: UserSchema[]
}
