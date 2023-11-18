import { CompetitionSchema, UserSchema } from 'src/types'
import { getAge } from './datetime'

export const checkParticipantFitRequirements = (competitionData?: CompetitionSchema, authorizedUser?: UserSchema) => {
	if (authorizedUser?.weight && authorizedUser?.birthDate) {
		return (
			authorizedUser.weight < (competitionData?.requirements?.weightCategory?.from ?? 199) ||
			authorizedUser.weight > (competitionData?.requirements?.weightCategory?.to ?? 0) ||
			(getAge(authorizedUser.birthDate) as number) < (competitionData?.requirements?.ageCategory?.from ?? 120) ||
			(getAge(authorizedUser.birthDate) as number) > (competitionData?.requirements?.ageCategory?.to ?? 0) ||
			(competitionData?.requirements?.gender && authorizedUser.gender !== competitionData.requirements.gender)
		)
	}
	return false
}
