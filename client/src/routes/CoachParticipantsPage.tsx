import { ReactElement, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCoachParticipantsApi } from 'src/api/requests/coach'
import { getCompetitionsApi, seTuserPaymentRequestToCheckApi } from 'src/api/requests/competitions'
import { SignUpForm } from 'src/components/SignUpForm'
import { MAX_PAYMENT_REQUEST_COUNT } from 'src/constants/maxRequestCount'
import { checkParticipantFitRequirements } from 'src/helpers/checkParticipantFitRequirements'
import { getAge, getFormattedDate, isPast } from 'src/helpers/datetime'
import { getPriceText } from 'src/helpers/getPriceText'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { useOptionalTranslation } from 'src/hooks/useOptionalTranslation'
import { setCompetitionData } from 'src/store/slices/competitionSlice'
import { updateCompetitionsListCompetition } from 'src/store/slices/competitionsSlice'
import { CoachParticipantPublicSchema, CompetitionSchema, UserSchema } from 'src/types'
import { Alert, Button, Input, Loader, Select } from 'src/ui'

const isRegistrationOpen = (competition: CompetitionSchema) =>
	!competition.started && !competition.endDate && !isPast(competition.registrationEndsAt)

type StudentRegistrationProps = {
	participant: CoachParticipantPublicSchema
	competition?: CompetitionSchema
	onRegistered: (competition: CompetitionSchema) => void
}

const StudentRegistration = ({ participant, competition, onRegistered }: StudentRegistrationProps) => {
	const { t } = useOptionalTranslation()
	const [message, setMessage] = useState('')
	const [pending, setPending] = useState(false)
	const [error, setError] = useState<string>()
	const payment = competition?.usersPaymentInfo?.find(info => info.userId === participant._id)
	const admitted = Boolean(payment?.paid || competition?.participants?.includes(participant._id ?? ''))
	const awaiting = !admitted && Boolean(payment?.requestedToCheck)
	const limitReached = (payment?.requestedCount ?? 0) >= MAX_PAYMENT_REQUEST_COUNT
	const registrationClosed = Boolean(
		competition && (competition.started || competition.endDate || isPast(competition.registrationEndsAt))
	)
	const unsuitable = Boolean(checkParticipantFitRequirements(competition, participant))
	const canRegister = competition && !admitted && !awaiting && !limitReached && !registrationClosed && !unsuitable

	const submit = async () => {
		if (!canRegister || pending || !competition?._id || !participant._id) return
		setPending(true)
		setError(undefined)
		try {
			const response = await seTuserPaymentRequestToCheckApi(
				{ message },
				{ id: competition._id, userId: participant._id }
			)
			if (response.error || !response.data) {
				setError(response.error?.error || t('coachRequestFailed'))
			} else {
				onRegistered(response.data)
				setMessage('')
			}
		} catch {
			setError(t('coachRequestFailed'))
		} finally {
			setPending(false)
		}
	}

	return (
		<article className='rounded-2xl border border-pale-grey p-5'>
			<h2 className='text-heading-6'>{participant.fullName}</h2>
			<p className='mt-2 text-sm'>
				{getAge(participant.birthDate)} {t('years')}, {participant.weight} {t('kg')}
			</p>
			<p className='text-sm'>
				{t('coachCity')}: {participant.address?.city || '—'}
			</p>
			<p className='text-sm'>
				{t('coachAddress')}:{' '}
				{[participant.address?.city, participant.address?.country].filter(Boolean).join(', ') || '—'}
			</p>
			{competition && (
				<div className='mt-4 grid gap-3'>
					{admitted && <Alert type='success' subtitle={t('coachStudentAdmitted')} />}
					{awaiting && <Alert type='info' subtitle={t('coachPaymentPending')} />}
					{!admitted && !awaiting && limitReached && <Alert subtitle={t('coachRequestLimit')} />}
					{!admitted && !awaiting && !limitReached && registrationClosed && (
						<p className='text-grey'>{t('registrationClosed')}</p>
					)}
					{!admitted && !awaiting && !limitReached && !registrationClosed && unsuitable && (
						<Alert subtitle={t('coachRequirementsMismatch')} />
					)}
					{canRegister && (
						<>
							{payment && <Alert type='info' subtitle={t('coachPaymentRejected')} />}
							<Input
								label={t('coachPaymentComment')}
								value={message}
								onChange={value => setMessage(value ?? '')}
								isTextarea
							/>
							<Button onClick={submit} loading={pending} disabled={pending || message.length > 2000}>
								{t('coachSubmitRegistration')}
							</Button>
						</>
					)}
					{error && <Alert subtitle={error} />}
				</div>
			)}
		</article>
	)
}

export const CoachParticipantsPage = (): ReactElement => {
	const { t } = useOptionalTranslation()
	const [searchParams] = useSearchParams()
	const dispatch = useAppDispatch()
	const coachId = useAppSelector(state => state.user.authorizedUser?._id)
	const [participants, setParticipants] = useState<CoachParticipantPublicSchema[]>([])
	const [total, setTotal] = useState(0)
	const [searchInput, setSearchInput] = useState('')
	const [search, setSearch] = useState('')
	const [offset, setOffset] = useState(0)
	const [competitions, setCompetitions] = useState<CompetitionSchema[]>([])
	const [competitionId, setCompetitionId] = useState(searchParams.get('competitionId') ?? '')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>()
	const [reload, setReload] = useState(0)
	const [creating, setCreating] = useState(false)
	const [created, setCreated] = useState(false)
	const competition = competitions.find(item => item._id === competitionId)

	useEffect(() => {
		const timer = setTimeout(() => {
			setOffset(0)
			setSearch(searchInput.trim())
		}, 300)
		return () => clearTimeout(timer)
	}, [searchInput])

	useEffect(() => {
		let cancelled = false
		const load = async () => {
			setLoading(true)
			setError(undefined)
			try {
				// Next pages only append participants; competitions are loaded with the first page.
				const [studentsResponse, competitionsResponse] = await Promise.all([
					getCoachParticipantsApi(search, offset),
					offset === 0 ? getCompetitionsApi() : undefined
				])
				if (cancelled) return
				if (studentsResponse.error || competitionsResponse?.error) {
					setError(studentsResponse.error?.error || competitionsResponse?.error?.error || t('coachRequestFailed'))
					return
				}
				setParticipants(current =>
					offset === 0 ? studentsResponse.data?.items ?? [] : [...current, ...(studentsResponse.data?.items ?? [])]
				)
				setTotal(studentsResponse.data?.total ?? 0)
				if (competitionsResponse) {
					const items = (competitionsResponse.data ?? []).filter(isRegistrationOpen)
					setCompetitions(items)
					setCompetitionId(current => (items.some(item => item._id === current) ? current : items[0]?._id ?? ''))
				}
			} catch {
				if (!cancelled) setError(t('coachRequestFailed'))
			} finally {
				if (!cancelled) setLoading(false)
			}
		}
		load()
		return () => {
			cancelled = true
		}
	}, [coachId, reload, search, offset, t])

	const onCreated = (participant: UserSchema) => {
		setSearchInput(participant.fullName ?? '')
		setOffset(0)
		setCreating(false)
		setCreated(true)
		setReload(value => value + 1)
	}

	const onRegistered = (updatedCompetition: CompetitionSchema) => {
		setCompetitions(current => current.map(item => (item._id === updatedCompetition._id ? updatedCompetition : item)))
		dispatch(setCompetitionData(updatedCompetition))
		if (updatedCompetition._id) {
			dispatch(
				updateCompetitionsListCompetition({ competition: updatedCompetition, competitionId: updatedCompetition._id })
			)
		}
	}

	return (
		<main className='container mx-auto grow px-4 py-8 md:px-8'>
			<div className='mb-5 flex flex-wrap items-center justify-between gap-4'>
				<h1 className='text-heading-4'>{t('coachStudents')}</h1>
				<Button
					type={creating ? 'outlined' : 'primary'}
					onClick={() => {
						setCreating(!creating)
						setCreated(false)
					}}
				>
					{t(creating ? 'coachBackToStudents' : 'coachCreateStudent')}
				</Button>
			</div>
			{creating ? (
				<SignUpForm onCreateParticipant={onCreated} />
			) : (
				<>
					<p className='mb-6 text-grey'>{t('coachRegistrationHelp')}</p>
					{created && <Alert type='success' subtitle={t('coachStudentCreated')} classes='mb-5' />}
					{competitions.length > 0 && (
						<div className='mb-6 grid max-w-xl gap-3'>
							<Select
								label={t('coachSelectCompetition')}
								chosenId={competitionId}
								wrapOptions
								onChange={value => setCompetitionId(value ?? '')}
								menuOptions={competitions.map(item => ({
									id: item._id ?? '',
									value: `${item.name} — ${getFormattedDate(item.startDate)}`
								}))}
							/>
							{competition?.price && <p>{getPriceText(competition, t)}</p>}
							<Button
								type='outlined'
								onClick={() => {
									setOffset(0)
									setReload(value => value + 1)
								}}
							>
								{t('coachRefresh')}
							</Button>
						</div>
					)}
					{competitions.length === 0 && !loading && !error && (
						<p className='mb-5 text-grey'>{t('coachNoCompetitions')}</p>
					)}
					{/* The search stays mounted while results reload, so typing is not interrupted. */}
					<div className='mb-6 max-w-xl'>
						<Input
							name='participantSearch'
							label={t('coachSearchParticipants')}
							value={searchInput}
							onChange={value => setSearchInput(value ?? '')}
							isSearch
						/>
					</div>
					{loading && offset === 0 && <Loader />}
					{error && (
						<div className='mb-5 grid gap-3'>
							<Alert subtitle={error} />
							<Button type='outlined' onClick={() => setReload(value => value + 1)}>
								{t('coachRefresh')}
							</Button>
						</div>
					)}
					{!(offset === 0 && (loading || error)) && (
						<>
							{participants.length === 0 && !loading && <p>{t('coachNoStudents')}</p>}
							<div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
								{participants.map(participant => (
									<StudentRegistration
										key={`${participant._id}-${competitionId}`}
										participant={participant}
										competition={competition}
										onRegistered={onRegistered}
									/>
								))}
							</div>
							{loading && <Loader />}
							{!loading && !error && participants.length < total && (
								<Button type='outlined' onClick={() => setOffset(participants.length)}>
									{t('coachLoadMore')}
								</Button>
							)}
						</>
					)}
				</>
			)}
		</main>
	)
}
