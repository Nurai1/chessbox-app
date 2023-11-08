import { CompetitionSchema, CompetitionGroupSchema } from 'src/types'
import { Gender } from 'src/constants/gender'

type CompetitionResultType = {
	[Gender.Woman]: CompetitionGroupSchema[]
	[Gender.Man]: CompetitionGroupSchema[]
}

export const getCompetitionResult = (competitionData: CompetitionSchema) => {
	if (competitionData && competitionData.groups && competitionData.groups[0]?.results?.length !== 0) {
		return competitionData.groups?.reduce(
			(acc, group) => {
				if (group.gender === Gender.Woman) {
					acc[Gender.Woman].push(group)
				} else {
					acc[Gender.Man].push(group)
				}
				return acc
			},
			{
				[Gender.Woman]: [],
				[Gender.Man]: []
			} as CompetitionResultType
		)
	}
	return null
}
