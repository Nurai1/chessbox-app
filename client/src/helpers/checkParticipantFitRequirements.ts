import { CompetitionSchema, UserSchema } from 'src/types'
import { getAge } from './datetime'

export const checkParticipantFitRequirements = (competitionData?: CompetitionSchema, authorizedUser?: UserSchema) => {
	if (authorizedUser?.weight && authorizedUser?.birthDate && competitionData?.requirements) {
		return (
			authorizedUser.weight < (competitionData.requirements?.weightCategory?.from ?? 0) ||
			authorizedUser.weight > (competitionData.requirements?.weightCategory?.to ?? 199) ||
			(getAge(authorizedUser.birthDate) as number) < (competitionData.requirements?.ageCategory?.from ?? 0) ||
			(getAge(authorizedUser.birthDate) as number) > (competitionData.requirements?.ageCategory?.to ?? 119) ||
			(competitionData.requirements?.gender && authorizedUser.gender !== competitionData.requirements.gender)
		)
	}
	return false
}
