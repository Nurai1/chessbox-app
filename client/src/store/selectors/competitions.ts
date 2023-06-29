import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../index'
import { authorizedUserId } from '../../mock/authorizedUserId'

const selectCompetitions = (state: RootState) => state.competitions.data

export const activeCompetitionsSelector = createSelector(selectCompetitions, activeCompetitions =>
	activeCompetitions.filter(competition => !competition.endDate)
)

export const currentUserCompetitionsSelector = createSelector(selectCompetitions, currentUserCompetitions =>
	currentUserCompetitions.filter(competition => competition.participants?.includes(authorizedUserId))
)

export const expiredCompetitionsSelector = createSelector(selectCompetitions, competitionsExpired =>
	competitionsExpired.filter(competition => competition.endDate)
)
