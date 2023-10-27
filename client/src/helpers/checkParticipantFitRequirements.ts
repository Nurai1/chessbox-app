import { CompetitionSchema, UserSchema } from 'src/types'
import { getAge } from './datetime'

export 	const checkParticipantFitRequirements = (competitionData?: CompetitionSchema, authorizedUser?: UserSchema) => {
    // long condition for TypeScript checks
    if (
        competitionData?.requirements?.weightCategory?.from &&
        competitionData.requirements.weightCategory.to &&
        authorizedUser?.weight &&
        competitionData?.requirements?.ageCategory?.from &&
        competitionData?.requirements?.ageCategory?.to &&
        authorizedUser?.birthDate
    ) {
        return (
            authorizedUser.weight < competitionData.requirements.weightCategory.from ||
            authorizedUser.weight > competitionData.requirements.weightCategory.to ||
            (getAge(authorizedUser.birthDate) as number) < competitionData.requirements.ageCategory.from ||
            (getAge(authorizedUser.birthDate) as number) > competitionData.requirements.ageCategory.to
        )
    }
    return false
}