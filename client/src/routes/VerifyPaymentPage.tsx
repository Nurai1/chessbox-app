import { ReactElement, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ReactComponent as ArrowLeftIcon } from 'src/assets/arrow-left.svg'
import { AppRoute } from 'src/constants/appRoute'
import { MAX_PAYMENT_REQUEST_COUNT } from 'src/constants/maxRequestCount'
import { getFormattedDate } from 'src/helpers/datetime'
import { tableSchemaPaymentCheck } from 'src/helpers/tableSchemas/tableSchemaPaymentCheck'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { fetchedOrExistingCompetitionSelector } from 'src/store/selectors/competitions'
import {
	addNewParticipant,
	fetchCompetitionById,
	getPaymentInfoUsers,
	setUserPaymentPaid
} from 'src/store/slices/competitionSlice'
import { CompetitionPaymentPaidType, UserPaymentInfo, UserSchema } from 'src/types'
import { Accordion, TableBody } from 'src/ui'
import { useOptionalTranslation } from '../hooks/useOptionalTranslation'

export type ParticipantsRequestedCheckTable = {
	userData?: UserSchema
} & UserPaymentInfo

export const VerifyPaymentPage = (): ReactElement => {
	const { t } = useOptionalTranslation()
	const [participantsRequestCheck, setParticipantsRequestCheck] = useState<ParticipantsRequestedCheckTable[]>()
	const [participantsExcluded, setParticipantsExcluded] = useState<ParticipantsRequestedCheckTable[]>()
	const [participantsPaid, setParticipantsPaid] = useState<ParticipantsRequestedCheckTable[]>()
	const { competitionId } = useParams()
	const competitionData = useAppSelector(fetchedOrExistingCompetitionSelector(competitionId))
	const { paymentInfoUsers, setUserPaymentPaidPending } = useAppSelector(state => state.competition)
	const dateStart = competitionData && getFormattedDate(competitionData.startDate, 'MMM D, HH:mm')
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!competitionData) {
			dispatch(fetchCompetitionById(competitionId as string))
		}
		if (!paymentInfoUsers) {
			dispatch(getPaymentInfoUsers(competitionId as string))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (competitionData?.usersPaymentInfo && paymentInfoUsers) {
			// joins userData and requestUserData
			const allParticipantsRequestedCheck = competitionData?.usersPaymentInfo.map(participant => {
				const userData = paymentInfoUsers?.find(user => user._id === participant.userId)
				return {
					...participant,
					userData
				}
			})

			const participantsRequestCheckData = allParticipantsRequestedCheck?.filter(
				participant =>
					participant.requestedToCheck &&
					participant.requestedCount &&
					!participant.paid &&
					participant.requestedCount < MAX_PAYMENT_REQUEST_COUNT
			)
			const participantsExcludedData = allParticipantsRequestedCheck?.filter(
				participant =>
					participant.requestedToCheck &&
					participant.requestedCount &&
					participant.requestedCount >= MAX_PAYMENT_REQUEST_COUNT
			)
			const participantsPaidData = allParticipantsRequestedCheck?.filter(participant => participant.paid)

			setParticipantsRequestCheck(participantsRequestCheckData)
			setParticipantsExcluded(participantsExcludedData)
			setParticipantsPaid(participantsPaidData)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [competitionData, paymentInfoUsers])

	const handleAcceptPaymentTrue = (payment: CompetitionPaymentPaidType) => {
		dispatch(setUserPaymentPaid(payment))
		dispatch(addNewParticipant(payment.path))
	}

	const handleAcceptPaymentFalse = (payment: CompetitionPaymentPaidType) => {
		dispatch(setUserPaymentPaid(payment))
	}

	const participantRequestedTable =
		participantsRequestCheck &&
		tableSchemaPaymentCheck({
			tableData: participantsRequestCheck,
			handleAcceptPaymentTrue,
			handleAcceptPaymentFalse,
			competitionId,
			setUserPaymentPaidPending,
			t
		})
	const participantExcludedTable =
		participantsExcluded && tableSchemaPaymentCheck({ tableData: participantsExcluded, t })
	const participantsPaidTable = participantsPaid && tableSchemaPaymentCheck({ tableData: participantsPaid, t })

	const showRequestTable = competitionData?.usersPaymentInfo && paymentInfoUsers?.length !== 0

	return (
		<main className='container mx-auto p-5'>
			<h1 className='text-heading-6'>{competitionData?.name}</h1>
			<p className='text-grey'>{dateStart}</p>
			<Link
				to={`/${AppRoute.Competitions}`}
				className='hover mt-11 mb-8 flex items-center gap-6 text-heading-2 hover:opacity-70'
			>
				<ArrowLeftIcon />
				{t('participants')}
			</Link>

			{showRequestTable && (
				<div className='rounded-3xl border border-pale-grey px-8'>
					{participantRequestedTable && (
						<Accordion title={<h3 className='text-heading-4'>{t('checkPayment')}</h3>} isOpenDefault>
							<TableBody rows={participantRequestedTable} />
						</Accordion>
					)}
					{participantExcludedTable && (
						<Accordion title={<h3 className='text-heading-4'>{t('participantExcluded')}</h3>} isOpenDefault>
							<TableBody rows={participantExcludedTable} />
						</Accordion>
					)}
					{participantsPaidTable && (
						<Accordion title={<h3 className='text-heading-4'>{t('participantAdmitted')}</h3>} isOpenDefault>
							<TableBody rows={participantsPaidTable} />
						</Accordion>
					)}
				</div>
			)}
		</main>
	)
}
