import { Fragment, ReactElement, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from 'src/assets/arrow-left.svg'
import { ReactComponent as Banknote } from 'src/assets/banknote.svg'
import { ReactComponent as Persons } from 'src/assets/persons.svg'
import { ReactComponent as ThreeStars } from 'src/assets/three-stars.svg'
import { ReactComponent as TwoStars } from 'src/assets/two-stars.svg'
import { PairInfo } from 'src/components'
import { AppRoute } from 'src/constants/appRoute'
import { getAge, getFormattedDate, isPast } from 'src/helpers/datetime'
import { PairType, getTimeTuplePlusMinutes, tableSchemaPairs } from 'src/helpers/tableSchemaPairs'
import { tableSchemaParticipants } from 'src/helpers/tableSchemaParticipants'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import {
	fetchCompetitionById,
	fetchCompetitionJudges,
	fetchCompetitionParticipants
} from 'src/store/slices/competitionSlice'
import { Button, Loader, Modal, TableBody, Tag, Timer } from 'src/ui'

const getGroupPairsLen = ({
	currentPairsLen,
	nextRoundParticipantsLen
}: {
	currentPairsLen: number
	nextRoundParticipantsLen: number
}) => {
	let allPairsLen = currentPairsLen + nextRoundParticipantsLen / 2 + currentPairsLen / 2
	let roundPairsLen = nextRoundParticipantsLen / 2 + currentPairsLen / 2

	while (roundPairsLen > 1) {
		roundPairsLen = Math.floor(roundPairsLen / 2)
		allPairsLen += roundPairsLen
	}

	return allPairsLen
}

export const CompetitionPage = (): ReactElement => {
	const dispatch = useAppDispatch()
	const { competitionId } = useParams()

	const currentUserPairRef = useRef<{ pair?: PairType; withPair?: boolean; startTime: string }>()
	const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
	const competitionDataExisting = useAppSelector(s => s.competitions.data).find(({ _id }) => _id === competitionId)
	const competitionDataFetched = useAppSelector(s => s.competition.data)

	const fetchError = useAppSelector(s => s.competition.error)
	const participants = useAppSelector(s => competitionId && s.competition.participants[competitionId])
	const judges = useAppSelector(s => competitionId && s.competition.judges[competitionId])
	const authorizedUserId = useAppSelector(state => state.user.authorizedUser?._id)
	const authLoading = useAppSelector(state => state.user.authLoading)
	const competitionData = competitionDataExisting || competitionDataFetched

	const dateStart = competitionData && getFormattedDate(competitionData.startDate, 'MMM D, HH:mm')
	const isParticipant = competitionData?.participants && competitionData.participants.includes(authorizedUserId ?? '')
	const isRegistrationClosed = competitionData && isPast(competitionData.registrationEndsAt)
	const isOver = competitionData && Boolean(competitionData.endDate)
	const participantsTable = participants && tableSchemaParticipants(participants)
	const requirements = competitionData?.requirements
	const startPointTimeTuple =
		competitionData?.startDate && Number(new Date(competitionData?.startDate)) - Date.now() > 0
			? getFormattedDate(competitionData.startDate, 'HH:mm').split(':')
			: getFormattedDate(new Date().toISOString(), 'HH:mm').split(':')

	useEffect(() => {
		if (!competitionDataExisting) {
			dispatch(fetchCompetitionById(competitionId as string))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (isRegistrationClosed) {
			dispatch(fetchCompetitionParticipants(competitionId as string))
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

	const handleSideMenuOpen = () => {
		setIsSideMenuOpen(!isSideMenuOpen)
	}

	const participate = () =>
		!isRegistrationClosed &&
		!isParticipant &&
		!isOver && (
			<div className='mb-[24px] lg:mb-0'>
				<div className='mb-[24px] flex items-baseline lg:flex-col lg:gap-[20px]'>
					<h3 className='mr-[8px] text-sm text-grey lg:text-base xl:text-[32px] xl:font-semibold xl:leading-[48px]'>
						Registration ends in:
					</h3>
					{competitionData && (
						<Timer
							time={competitionData.registrationEndsAt}
							containerClasses='xl:h-[107px] xl:w-[107px] '
							countNumbersClasses='xl:text-[32px] xl:leading-[48px]'
						/>
					)}
				</div>
				<div className='flex flex-col gap-[15px] md:flex-row md:gap-[20px] lg:flex-col lg:gap-[10px]'>
					<Button onClick={() => ''} classes='md:w-full'>
						Participate
					</Button>
					<Button
						onClick={handleSideMenuOpen}
						type='outlined'
						classes='md:w-full lg:font-normal lg:text-sm xl:text-base xl:font-bold'
					>
						Check out participants
					</Button>
				</div>
			</div>
		)

	const participant = () =>
		isParticipant &&
		!isOver &&
		!isRegistrationClosed && (
			<div className='relative mb-[24px] lg:mb-0 lg:h-fit lg:rounded-[12px] lg:border lg:p-[30px_10px_10px_10px] xl:p-[45px_25px_25px_25px]'>
				<div className='hidden lg:mb-[25px] lg:block xl:mb-[40px]'>
					<h3 className='hidden lg:mb-[20px] lg:block lg:text-xl lg:font-semibold xl:mb-[30px] xl:text-[32px] xl:leading-[48px]'>
						You are <br />
						participant!
					</h3>
					<p className='hidden text-sm lg:block xl:text-base'>Additional information will be published later</p>
					<ThreeStars
						className='absolute top-[15px] left-[92px] w-[24px]
					xl:top-[34px] xl:left-[150px] xl:w-[44px]'
					/>
					<ThreeStars
						className='2xl:h-[37px absolute top-[24px] left-[143px] w-[24px]
					xl:top-[50px] xl:left-[260px] xl:w-[44px]'
					/>
					<TwoStars
						className='absolute top-[70px] left-[130px] w-[23px]
					xl:top-[120px] xl:left-[240px] xl:w-[40px]'
					/>
				</div>
				<div className='flex flex-col gap-[15px] md:flex-row md:gap-[20px] lg:flex-col lg:gap-[10px]'>
					<Button onClick={() => ''} type='outlined' classes='pointer-events-none md:w-full lg:hidden'>
						You are participant!
					</Button>
					<Button
						onClick={handleSideMenuOpen}
						type='outlined'
						classes='md:w-full lg:font-normal lg:text-sm lg:px-0 xl:text-base xl:font-bold'
					>
						Check out <span className='md:hidden xl:inline'>other</span>
						participants
					</Button>
				</div>
			</div>
		)

	const groupsAllPairsLen = competitionData?.groups?.map(group =>
		getGroupPairsLen({
			currentPairsLen: group.currentRoundPairs?.length ?? 0,
			nextRoundParticipantsLen: group.nextRoundParticipants?.length ?? 0
		})
	)

	return (
		<>
			<main className='container relative mx-auto grow px-[17px] pb-[50px] pt-[30px] md:pt-[38px] xl:pl-[103px] xl:pr-[50px] xl:pt-[55px]'>
				<Link
					to={`/${AppRoute.Competitions}`}
					className='hidden transition hover:opacity-70 xl:absolute xl:left-[38px] xl:top-[77px] xl:block'
				>
					<ArrowLeft />
				</Link>
				{/* authLoading needs here because we save in currentUserPairRef time data on render */}
				{authLoading && !competitionData && !fetchError && <Loader />}
				{fetchError && <h2>{fetchError}</h2>}
				{competitionData && (
					<>
						<div className='lg:grid lg:grid-cols-[1fr_190px] lg:gap-[0_15px] xl:grid-cols-[1fr_345px] xl:gap-[0_40px]'>
							<div>
								<h1 className='mb-[15px] text-heading-4 lg:mb-[10px] xl:mb-[24px] xl:text-heading-1'>
									{competitionData.name}
								</h1>
								<p className='mb-[15px] text-sm text-grey xl:mb-[24px] xl:text-heading-3'>{dateStart}</p>
								<div className='mb-[35px] flex flex-wrap gap-4 xl:mb-[64px]'>
									{competitionData.price && (
										<Tag
											img={<Banknote className='max-5 mr-2' />}
											text={`Price ${competitionData.price.currentValue} $`}
										/>
									)}
									{competitionData.participants && (
										<Tag
											img={<Persons className='max-5 mr-2' />}
											text={`${competitionData.participants.length} participant${
												competitionData.participants.length === 1 ? '' : 's'
											} enrolled`}
										/>
									)}
								</div>
								{requirements && (
									<div className='mb-[24px] flex items-center'>
										<p className='max-w-[150px] pr-[16px] text-[#6C6A6C] xl:font-bold'>Competition requirements:</p>
										<div className='min-w-[112px] border-x px-[16px]'>
											<p className='mb-[8px] text-sm xl:text-base'>Age:</p>
											<p className='whitespace-nowrap font-bold'>
												{requirements?.ageCategory?.from} - {requirements?.ageCategory?.to}{' '}
											</p>
										</div>
										<div className='min-w-[100px] pl-[16px]'>
											<p className='mb-[8px] text-sm xl:text-base'>Weight:</p>
											<p className='whitespace-nowrap font-bold'>
												{requirements?.weightCategory?.from} - {requirements?.weightCategory?.to}
												<span className='text-[#6C6A6C]'> kg</span>
											</p>
										</div>
									</div>
								)}
							</div>
							{participate()}
							{participant()}
							{isRegistrationClosed && !isParticipant && <h2>Registration Closed</h2>}
							{isRegistrationClosed && isParticipant && <h2>Time before start {competitionData.startDate}</h2>}
							<div>
								<p className='mb-[8px] text-grey xl:font-bold'>Description:</p>
								<p className='mb-[24px] 2xl:text-body-1'>{competitionData.description}</p>
							</div>
						</div>
						{isRegistrationClosed && (
							<>
								{isParticipant && !currentUserPairRef.current?.withPair && (
									<h2 className='mb-[10px] text-xl font-medium md:mb-[15px] lg:mb-[34px] xl:text-4xl xl:font-bold'>
										You will be paired with other participant at {currentUserPairRef.current?.startTime}
									</h2>
								)}
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
								<h2 className='mb-[20px] text-xl font-medium md:mb-[34px] xl:text-4xl xl:font-bold'>
									Competition schedule
								</h2>
								<div className='xl:px[50px] flex grow flex-col lg:rounded-3xl lg:border lg:border-[#DADADA] lg:px-[40px] lg:pt-[33px] xl:pt-[63px]'>
									{competitionData.groups?.map(
										(
											{ _id, gender, ageCategory, weightCategory, currentRoundPairs, nextRoundParticipants },
											groupIndex
										) => {
											const currentRoundPairsLen = currentRoundPairs?.length ?? 0
											const competitionJudgesLen = competitionData?.judges?.length ?? 1

											let pairsBeforeLen = 0
											for (let i = 0; i < groupIndex; i += 1) {
												pairsBeforeLen += groupsAllPairsLen?.[i] ?? 0
											}

											pairsBeforeLen =
												pairsBeforeLen % competitionJudgesLen === 0
													? pairsBeforeLen
													: pairsBeforeLen + (pairsBeforeLen % competitionJudgesLen)

											const nextRoundParticipantsStartTime = getTimeTuplePlusMinutes(
												startPointTimeTuple,
												((pairsBeforeLen + currentRoundPairsLen) * 10) / competitionJudgesLen
											).join(':')

											return (
												<Fragment key={_id}>
													<h3 className='mb-[17px] font-bold md:mb-[32px] xl:text-2xl [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-[24px]'>
														{getTimeTuplePlusMinutes(
															startPointTimeTuple,
															(pairsBeforeLen * 10) / competitionJudgesLen
														).join(':')}
														<span className='ml-3 inline-block capitalize'>{gender}</span> {ageCategory?.from}-
														{ageCategory?.to} age, {weightCategory?.from}-{weightCategory?.to}kg
													</h3>
													{currentRoundPairs && participants && judges ? (
														<TableBody
															rows={tableSchemaPairs({
																tableData: currentRoundPairs,
																participants,
																judges,
																startTimeTuple: getTimeTuplePlusMinutes(
																	startPointTimeTuple,
																	(pairsBeforeLen * 10) / competitionJudgesLen
																),
																currentUser: { currentUserPairRef, authorizedUserId }
															})}
														/>
													) : (
														<Loader />
													)}
													{nextRoundParticipants?.length && (
														<h3 className='mb-[17px] font-bold md:mb-[32px] xl:text-2xl [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-[24px]'>
															{getTimeTuplePlusMinutes(
																startPointTimeTuple,
																((pairsBeforeLen + currentRoundPairsLen) * 10) / competitionJudgesLen
															).join(':')}
															<span className='ml-3 inline-block capitalize'>{gender}</span> {ageCategory?.from}-
															{ageCategory?.to} age, {weightCategory?.from}-{weightCategory?.to}kg
														</h3>
													)}
													{nextRoundParticipants?.map((participantId, participantIdx) => {
														const nextRoundParticipant = participants
															? participants.find(({ _id: pId }) => pId === participantId)
															: null

														if (participantId === authorizedUserId)
															currentUserPairRef.current = {
																withPair: false,
																startTime: nextRoundParticipantsStartTime
															}

														return (
															<div
																key={nextRoundParticipant?._id}
																className='flex h-20 w-full items-center py-3 md:pr-6'
															>
																<div className='h-full w-[50px] font-bold'>{participantIdx}</div>
																<div className='flex h-full grow flex-col'>
																	<div className='mb-[7px] text-sm text-black xl:text-base'>
																		{nextRoundParticipant?.fullName}
																	</div>
																	<div className='text-[#6C6A6C]'>
																		{getAge(nextRoundParticipant?.birthDate)} age, {nextRoundParticipant?.weight} kg
																	</div>
																</div>
																<div>
																	<span className='text-sm uppercase text-[#4565D9] md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 xl:col-start-3 xl:col-end-4 xl:row-auto xl:text-base xl:font-bold'>
																		WAITING
																	</span>
																</div>
															</div>
														)
													})}
												</Fragment>
											)
										}
									)}
								</div>
							</>
						)}
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
