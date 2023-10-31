import { ReactElement, useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button, Loader, Modal, TableBody, Tag } from 'src/ui'
import { ReactComponent as BanknoteIcon } from 'src/assets/banknote.svg'
import { ReactComponent as PersonsIcon } from 'src/assets/persons.svg'
import { ReactComponent as ArrowLeftIcon } from 'src/assets/arrow-left.svg'
import { ReactComponent as ArrowRightIcon } from 'src/assets/arrow-right-long.svg'
import { ReactComponent as WarningIcon } from 'src/assets/warning.svg'
import { ReactComponent as HourGlass } from 'src/assets/hourglass.svg'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { AppRoute } from 'src/constants/appRoute'
import { getFormattedDate, isPast } from 'src/helpers/datetime'
import {
	PairInfo,
	CompetitionRequirements,
	YouAreParticipant,
	RegistrationEndsTimer,
	CompetitionParticipantsTable,
	CompetitonIsOver,
	TimerBeforeParticipantFight,
	TimerBeforeCompetitionStarts,
	CompetitionInfo,
	CompetitionResultList
} from 'src/components'
import { PairType } from 'src/helpers/tableSchemas/tableSchemaPairs'
import { tableSchemaParticipants } from 'src/helpers/tableSchemas/tableSchemaParticipants'
import {
	fetchCompetitionById,
	fetchCompetitionJudges,
	fetchCompetitionParticipants,
	setCompetitionData
} from 'src/store/slices/competitionSlice'
import { Role } from 'src/constants/role'
import { existingOrFetchedCompetitionSelector } from 'src/store/selectors/competitions'

export const CompetitionPage = (): ReactElement => {
	const dispatch = useAppDispatch()
	const { competitionId } = useParams()
	const currentUserPairRef = useRef<{ pair?: PairType; startTime: string }>()
	const navigate = useNavigate()
	const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
	const fetchError = useAppSelector(s => s.competition.error)
	const participants = useAppSelector(s => competitionId && s.competition.participants[competitionId])
	const judges = useAppSelector(s => competitionId && s.competition.judges[competitionId])
	const { authorizedUser, authLoading } = useAppSelector(state => state.user)
	const competitionData = useAppSelector(existingOrFetchedCompetitionSelector(competitionId))
	const dateStart = competitionData && getFormattedDate(competitionData.startDate, 'MMM D, HH:mm')
	const isParticipant =
		competitionData?.participants && competitionData.participants.includes(authorizedUser?._id ?? '')
	const isCompetitionOver = competitionData && Boolean(competitionData.endDate)
	const isCompetitionOnGoing = competitionData && isPast(competitionData.startDate) && !isCompetitionOver
	const participantsTable = participants && tableSchemaParticipants(participants)
	const [isTimeOver, setIsTimeOver] = useState(competitionData && isPast(competitionData.startDate))
	const [isRegistrationClosed, setIsRegistrationClosed] = useState(false)

	useEffect(() => {
		if (!competitionData) {
			dispatch(fetchCompetitionById(competitionId as string))
		} else {
			dispatch(setCompetitionData(competitionData))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		const pollingInterval = setInterval(() => {
			if (isCompetitionOnGoing && isParticipant) {
				dispatch(fetchCompetitionById(competitionId as string))
			} else {
				clearInterval(pollingInterval)
			}
		}, 5000)
		return () => clearInterval(pollingInterval)
	}, [competitionData, competitionId, dispatch, isCompetitionOnGoing])

	useEffect(() => {
		if (isRegistrationClosed && !participants) {
			dispatch(fetchCompetitionParticipants(competitionId as string))
		}

		if (isRegistrationClosed && !judges) {
			dispatch(fetchCompetitionJudges(competitionId as string))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRegistrationClosed])

	useEffect(() => {
		if (!participants && isSideMenuOpen) {
			dispatch(fetchCompetitionParticipants(competitionId as string))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSideMenuOpen])

	useEffect(() => {
		if (currentUserPairRef) {
			dispatch(fetchCompetitionParticipants(competitionId as string))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUserPairRef])

	useEffect(() => {
		if (competitionData) {
			setIsTimeOver(isPast(competitionData.startDate))
			setIsRegistrationClosed(isPast(competitionData.registrationEndsAt))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [competitionData])

	const yourPlace = authorizedUser?.competitionsHistory?.find(
		competition => competition.competitionId === competitionId
	)?.placeNumber

	const handleSideMenuOpen = () => {
		setIsSideMenuOpen(!isSideMenuOpen)
	}

	const timeBeforeStart =
		(isRegistrationClosed &&
			isParticipant &&
			!currentUserPairRef.current?.pair?.calledForPreparation &&
			!isCompetitionOver) ||
		(isRegistrationClosed && !isCompetitionOver && authorizedUser?.role === Role.ChiefJudge)
	const registrationClosed =
		!isCompetitionOver && isRegistrationClosed && !isParticipant && authorizedUser?.role !== Role.ChiefJudge
	const showRegistrationEndsTimer = !isRegistrationClosed && !isCompetitionOnGoing
	const showYouAreParticipant = isParticipant && !isCompetitionOver && !isRegistrationClosed
	console.log(isParticipant)

	return (
		<>
			<main className='container relative mx-auto grow px-4 py-8 md:py-9 xl:py-14 xl:pl-[6.5rem] xl:pr-[3.125rem]'>
				<Link
					to={`/${AppRoute.Competitions}`}
					className='hidden transition hover:opacity-70 xl:absolute xl:left-[38px] xl:top-[77px] xl:block'
				>
					<ArrowLeftIcon />
				</Link>
				{/* authLoading needs here because we save in currentUserPairRef time data on render */}
				{authLoading && !competitionData && !fetchError && <Loader />}
				{fetchError && <h2>{fetchError}</h2>}
				{competitionData && (
					<>
						<div className='lg:grid lg:grid-cols-[1fr_13.75rem] lg:gap-[0_15px] xl:grid-cols-[1fr_24.5rem] xl:gap-[0_40px]'>
							<div>
								<h1 className='mb-[15px] text-heading-4 lg:mb-[10px] xl:mb-[24px] xl:text-heading-1'>
									{competitionData.name}
								</h1>
								<p className='mb-[15px] text-sm text-grey xl:mb-[24px] xl:text-heading-3'>{dateStart}</p>
								<div className='mb-[35px] flex flex-wrap gap-4 xl:mb-[64px]'>
									{competitionData.price && (
										<Tag
											img={<BanknoteIcon className='max-5 mr-2' />}
											text={`Price ${competitionData.price.currentValue} $`}
										/>
									)}
									{competitionData.participants && (
										<Tag
											img={<PersonsIcon className='max-5 mr-2' />}
											text={`${competitionData.participants.length} participant${
												competitionData.participants.length === 1 ? '' : 's'
											} enrolled`}
										/>
									)}
								</div>
								<CompetitionRequirements competitionRequirements={competitionData.requirements} classes='mb-6' />
							</div>
							{showRegistrationEndsTimer && (
								<RegistrationEndsTimer
									competitionData={competitionData}
									onTimeOver={() => setIsRegistrationClosed(true)}
									classes={isParticipant ? 'hidden' : ''}
									competitionId={competitionId as string}
								>
									<Button
										onClick={handleSideMenuOpen}
										type='outlined'
										classes='md:w-full lg:font-normal lg:text-sm xl:max-w-[21rem] xl:text-base xl:font-bold'
									>
										Check out participants
									</Button>
								</RegistrationEndsTimer>
							)}
							{showYouAreParticipant && <YouAreParticipant onSideMenuOpen={handleSideMenuOpen} />}
							{registrationClosed && (
								<CompetitionInfo
									title={<span className='block lg:mt-2 xl:mt-0'>Registration Closed</span>}
									img={
										<HourGlass className='h-7 w-7 lg:absolute lg:right-6 lg:bottom-6 lg:h-10 lg:w-10 xl:right-10 xl:bottom-10 xl:h-16 xl:w-16' />
									}
								/>
							)}
							{timeBeforeStart && (
								<div>
									<TimerBeforeCompetitionStarts
										competitionData={competitionData}
										onTimeOver={() => setIsTimeOver(true)}
									/>
									{authorizedUser?.role === Role.ChiefJudge && isTimeOver && (
										<div className='fixed inset-x-0 bottom-0 bg-white p-6 shadow-lg lg:static lg:p-0 lg:shadow-none'>
											<Button classes='w-full lg:mb-[1.25rem]' onClick={() => navigate(AppRoute.JudgeCompetition)}>
												To competition
											</Button>
										</div>
									)}
								</div>
							)}
							<TimerBeforeParticipantFight currentPair={currentUserPairRef.current?.pair} />
							{isCompetitionOver && authorizedUser?.role !== Role.ChiefJudge && <CompetitonIsOver place={yourPlace} />}
							<div>
								<p className='mb-[8px] text-[#6C6A6C] xl:font-bold'>Description:</p>
								<p className='mb-9'>{competitionData.description}</p>
								{authorizedUser?.role === 'chief_judge' && competitionData.groups?.length === 0 && (
									<div className={`${!isRegistrationClosed && 'pointer-events-none opacity-30'}`}>
										<Link
											to={AppRoute.JudgeChoice}
											className='b-2.5 flex items-center gap-5 text-lg font-bold transition hover:opacity-70 xl:text-4xl xl:leading-normal'
										>
											Set up the competition
											<ArrowRightIcon className='w-8 xl:w-[3.125rem]' />
										</Link>
										<div className='mb-5 flex max-w-[40rem] items-center gap-3.5 md:mb-8'>
											<WarningIcon />
											<p>
												You need to assign judges, create groups, connect judges to pairs and assign orders to groups
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
						{isRegistrationClosed && competitionData.groups?.every(group => !group.isCompleted) && (
							<>
								{isParticipant && currentUserPairRef.current?.pair && (
									<>
										<h2 className='mb-[10px] text-xl font-medium md:mb-[15px] lg:mb-[34px] xl:text-4xl xl:font-bold'>
											Your match:
										</h2>
										<PairInfo
											pairData={currentUserPairRef.current?.pair}
											startTime={currentUserPairRef.current?.startTime}
											zoomLink={competitionData.zoomLink}
											classes='mb-[53px] 2xl:mb-[100px]'
										/>
									</>
								)}

								{competitionData.groups?.length !== 0 && participants && judges && authorizedUser ? (
									<>
										<h2 className='mb-[20px] text-xl font-medium md:mb-[34px] xl:text-4xl xl:font-bold'>
											Competition schedule
										</h2>
										<CompetitionParticipantsTable
											competitionData={competitionData}
											participants={participants}
											judges={judges}
											authorizedUser={authorizedUser}
											currentUserPairRef={currentUserPairRef}
										/>
									</>
								) : (
									<Loader />
								)}
							</>
						)}
						{/* {competitionData.groups && competitionData?.groups[0].results?.length !== 0 &&  competitionData.groups?.map(group => (
						<CompetitionResultList age={group.ageCategory} weight={group.weightCategory}/>
					))} */}
						{competitionData.groups && <CompetitionResultList competitionData={competitionData} />}
					</>
				)}
			</main>
			<Modal
				isOpen={isSideMenuOpen}
				onClose={handleSideMenuOpen}
				title='Participants'
				modalType='sideMenu'
				bottomGradient
				content={
					<>
						{!participants && <Loader classes='h-full' />}
						{participants?.length === 0 && <p className='p-6 md:py-6 md:px-[1.875rem]'>No participants yet</p>}
						{participantsTable && (
							<div className='p-6 md:py-6 md:px-[1.875rem]'>
								<TableBody rows={participantsTable} />
							</div>
						)}
					</>
				}
			/>
		</>
	)
}
