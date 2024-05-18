import { TFunction } from 'src/hooks/useOptionalTranslation'
import { CompetitionSchema } from '../types'

export const getPriceText = (competition: CompetitionSchema, t: TFunction) => {
	return `${t('startFee')}: ${competition.price?.currentValue} ${competition.price?.currency}${competition.price?.valueForMembers ? ` / ${t('members')}: ${competition.price?.valueForMembers} ${competition.price?.currency}` : ''}`
}
