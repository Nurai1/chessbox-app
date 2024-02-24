import { CompetitionGroupSchema, ParticipantSchema } from 'src/types'

export const getSortedRuseltParticipants = (participants: ParticipantSchema[], group?: CompetitionGroupSchema) => {
	return group?.results?.reduce((acc, result) => {
		participants.forEach(participant => {
			if (participant._id === result.userId) {
				acc.push(participant)
			}
		})
		return acc
	}, [] as ParticipantSchema[])
}
