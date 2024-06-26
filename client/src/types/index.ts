import { components, paths } from './generated'

export type UserSchema = components['schemas']['User']
export type GetUsersParams = paths['/api/users']['get']['parameters']['query']
export type CompetitionSchema = components['schemas']['Competition']
export type CompetitionGroupSchema = components['schemas']['CompetitionGroup']
export type AgeCategorySchema = components['schemas']['CompetitionGroup']['ageCategory']
export type WeightCategorySchema = components['schemas']['CompetitionGroup']['weightCategory']
export type PairSchema = components['schemas']['Pair']
export type CompetitionRequirementsSchema = components['schemas']['Competition']['requirements']
export type SignUpDataSchema = paths['/api/signup']['post']['requestBody']['content']['application/json']
export type ConfirmEmailDataSchema =
	paths['/api/user/confirmEmail']['patch']['requestBody']['content']['application/json']
export type SignInDataSchema = paths['/api/login']['post']['requestBody']['content']['application/json']
export type ChangePasswordDataSchema =
	paths['/api/user/changePassword']['patch']['requestBody']['content']['application/json']
export type ForgotPasswordDataSchema =
	paths['/api/user/forgotPassword']['post']['requestBody']['content']['application/json']
export type SetCompetitionJudgesSchema =
	paths['/api/competition/setJudgesToCompetition']['patch']['requestBody']['content']['application/json']
export type SetJudgesToPairsSchema =
	paths['/api/competition/setJudgesToPairs']['patch']['requestBody']['content']['application/json']
export type ParticipantsOrdersByGroupSchema =
	paths['/api/competition/{id}/setParticipantsOrdersByGroup']['patch']['requestBody']['content']['application/json'] &
		Record<string, string[]>
export type CompetitionGroupsOrdersSchema =
	paths['/api/competition/{id}/setCompetitionGroupsOrders']['patch']['requestBody']['content']['application/json']
export type CompetitionGroupsOrders =
	paths['/api/competition/{id}/setCompetitionGroupsOrders']['patch']['requestBody']['content']['application/json']['orders']
export type DeleteCompetitionGroupSchema =
	paths['/api/competition/{id}/group']['delete']['requestBody']['content']['application/json']
export type AddNewParticipantSchema =
	paths['/api/competition/{id}/addNewParticipant']['patch']['requestBody']['content']['application/json']
export type SetBreakTimeSchema =
	paths['/api/competition/{id}/setCompetitionBreakTime']['patch']['requestBody']['content']['application/json']
export type CallPairPreparationSchema =
	paths['/api/competition/callPairPreparation']['patch']['requestBody']['content']['application/json']
export type DefineWinnerSchema =
	paths['/api/competition/defineWinner']['patch']['requestBody']['content']['application/json']
export type AcceptPairFightBodySchema =
	paths['/api/competition/acceptPairFight']['patch']['requestBody']['content']['application/json']
export type LaunchNextGroupRoundApiSchema =
	paths['/api/competition/launchNextGroupRound']['patch']['requestBody']['content']['application/json']
export type SeTuserPaymentRequestToCheckApiSchema =
	paths['/api/competition/{id}/setUserPaymentRequestToCheck/{userId}']['patch']['requestBody']['content']['application/json']
export type SetUserPaymentPaidApiSchema =
	paths['/api/competition/{id}/setUserPaymentPaid/{userId}']['patch']['requestBody']['content']['application/json']
type PaymentParamsSchema = paths['/api/competition/{id}/setUserPaymentPaid/{userId}']['patch']['parameters']['path']

export type UserPaymentInfo = {
	userId?: string | undefined
	paid?: boolean | undefined
	requestedToCheck?: boolean | undefined
	requestedCount?: number | undefined
	message?: string | undefined
}

export type ErrorPayload = { errorMessage: string; response: Response }
export type CompetitionSchemaJudge = Omit<CompetitionSchema, 'judges'> & {
	judges: UserSchema[]
}
export type ParticipantSchema = {
	group?: string
	groupOverlap?: boolean
} & UserSchema
export type ChooseWinnerType = Omit<DefineWinnerSchema, 'competitionId'>

export type CompetitionPaymentDataType = {
	path: PaymentParamsSchema
	body: SeTuserPaymentRequestToCheckApiSchema
}

export type CompetitionPaymentPaidType = {
	path: PaymentParamsSchema
	body: SetUserPaymentPaidApiSchema
}
export type OlympicGridTree = { userId?: string; pair?: [OlympicGridTree, OlympicGridTree] }
