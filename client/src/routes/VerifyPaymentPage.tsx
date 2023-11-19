import { ReactElement, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from 'src/hooks/redux'
import { fetchedOrExistingCompetitionSelector } from 'src/store/selectors/competitions'
import { getFormattedDate } from 'src/helpers/datetime'
import {
	fetchCompetitionById,
	getPaymentInfoUsers,
	setUserPaymentPaid,
	addNewParticipant
} from 'src/store/slices/competitionSlice'
import { updateCompetitionsListCompetition } from 'src/store/slices/competitionsSlice'
import { AppRoute } from 'src/constants/appRoute'
import { ReactComponent as ArrowLeftIcon } from 'src/assets/arrow-left.svg'
import { Accordion, TableBody, Loader } from 'src/ui'
import { tableSchemaPaymentCheck } from 'src/helpers/tableSchemas/tableSchemaPaymentCheck'
import { UserPaymentInfo, UserSchema, CompetitionPaymentPaidType, CompetitionSchema } from 'src/types'
import { MAX_PAYMENT_REQUEST_COUNT } from 'src/constants/maxRequestCount'

export type ParticipantsRequestedCheckTable = {
	userData?: UserSchema
} & UserPaymentInfo

export const VerifyPaymentPage = (): ReactElement => {
	const [participantsRequestCheck, setParticipantsRequestCheck] = useState<ParticipantsRequestedCheckTable[]>()
	const [participantsExcluded, setParticipantsExcluded] = useState<ParticipantsRequestedCheckTable[]>()
	const [participantsPaid, setParticipantsPaid] = useState<ParticipantsRequestedCheckTable[]>()
	const { competitionId } = useParams()
	const competitionData = useAppSelector(fetchedOrExistingCompetitionSelector(competitionId))
	const { paymentInfoUsers, setUserPaymentPaidPending, competitionPending, setUserPaymentPaidSuccess } = useAppSelector(
		state => state.competition
	)
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
					participant.requestedCount <= MAX_PAYMENT_REQUEST_COUNT
			)
			const participantsExcludedData = allParticipantsRequestedCheck?.filter(
				participant =>
					!participant.requestedToCheck &&
					participant.requestedCount &&
					!participant.paid &&
					participant.requestedCount >= MAX_PAYMENT_REQUEST_COUNT
			)
			const participantsPaidData = allParticipantsRequestedCheck?.filter(participant => participant.paid)

			setParticipantsRequestCheck(participantsRequestCheckData)
			setParticipantsExcluded(participantsExcludedData)
			setParticipantsPaid(participantsPaidData)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [competitionData, paymentInfoUsers])

	useEffect(() => {
		if (setUserPaymentPaidSuccess) {
			dispatch(
				updateCompetitionsListCompetition({
					competition: competitionData as CompetitionSchema,
					competitionId: competitionId as string
				})
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setUserPaymentPaidSuccess])

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
			competitionId
		})
	const participantExcludedTable = participantsExcluded && tableSchemaPaymentCheck({ tableData: participantsExcluded })
	const participantsPaidTable = participantsPaid && tableSchemaPaymentCheck({ tableData: participantsPaid })

	const showRequestTable = competitionData?.usersPaymentInfo && paymentInfoUsers?.length !== 0

	if (!competitionData && !paymentInfoUsers && (setUserPaymentPaidPending || competitionPending)) {
		return <Loader />
	}

	return (
		<main className='container mx-auto p-5'>
			<h1 className='text-heading-6'>{competitionData?.name}</h1>
			<p className='text-grey'>{dateStart}</p>
			<Link
				to={`/${AppRoute.Competitions}`}
				className='hover mt-11 mb-8 flex items-center gap-6 text-heading-2 hover:opacity-70'
			>
				<ArrowLeftIcon />
				Participants
			</Link>

			{showRequestTable && (
				<div className='rounded-3xl border border-pale-grey px-8'>
					{participantRequestedTable && participantRequestedTable?.length !== 0 && (
						<Accordion
							title={<h3 className='text-heading-4'>These participants request to check payment</h3>}
							isOpenDefault
						>
							<TableBody rows={participantRequestedTable} />
						</Accordion>
					)}
					{participantExcludedTable && participantExcludedTable?.length !== 0 && (
						<Accordion
							title={<h3 className='text-heading-4'>Participants excluded due to 3 incorrect payment request</h3>}
							isOpenDefault
						>
							<TableBody rows={participantExcludedTable} />
						</Accordion>
					)}
					{participantsPaidTable && participantsPaidTable?.length !== 0 && (
						<Accordion
							title={<h3 className='text-heading-4'>Participants admitted to the competition</h3>}
							isOpenDefault
						>
							<TableBody rows={participantsPaidTable} />
						</Accordion>
					)}
				</div>
			)}
		</main>
	)
}
