import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../index'

export const selectCompetitions = (state: RootState) => state.competitions.data

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
