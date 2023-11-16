import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../rootReducer'

export const selectCompetitions = (state: RootState) => state.competitions.data
export const selectCompetition = (state: RootState) => state.competition.data

export const activeCompetitionsSelector = createSelector(selectCompetitions, activeCompetitions =>
	activeCompetitions.filter(competition => !competition.endDate)
)

export const currentUserCompetitionsSelector = (authorizedUserId?: string) =>
	createSelector(selectCompetitions, currentUserCompetitions =>
		currentUserCompetitions.filter(competition => competition.participants?.includes(authorizedUserId ?? ''))
	)

export const expiredCompetitionsSelector = createSelector(selectCompetitions, competitionsExpired =>
	competitionsExpired.filter(competition => competition.endDate)
)

export const existingCompetitionSelector = (competitionId?: string) =>
	createSelector(selectCompetitions, competitions => competitions.find(({ _id }) => _id === competitionId))

export const fetchedOrExistingCompetitionSelector = (competitionId?: string) => (state: RootState) =>
	selectCompetition(state) || existingCompetitionSelector(competitionId)(state)
