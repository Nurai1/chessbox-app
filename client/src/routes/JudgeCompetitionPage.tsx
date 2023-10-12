import { ReactElement, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowLeftIcon } from 'src/assets/arrow-left.svg'
import { ReactComponent as BanknoteIcon } from 'src/assets/banknote.svg'
import { ReactComponent as PersonsIcon } from 'src/assets/persons.svg'
import { ReactComponent as TwoStarsIcon } from 'src/assets/two-stars.svg'
import { ReactComponent as WhatsappIcon } from 'src/assets/whatsapp.svg'
import { ReactComponent as WarniniIcon } from 'src/assets/warning.svg'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { AppRoute } from 'src/constants/appRoute'
import { Tag, Button, Modal, Input, Alert, BreakTimer, Loader } from 'src/ui'
import { AlertPropTypes } from 'src/ui/Alert/Alert'
import { CompetitionRequirements, CompetitionParticipantsTable } from 'src/components'
import { getFormattedDate } from 'src/helpers/datetime'
import {
	fetchCompetitionById,
	setCompetitionData,
	fetchCompetitionJudges,
	fetchCompetitionParticipants,
	setBreakTime,
	setBreakTimeLocalState,
	resetBreakTime,
	resetBreakTimeSuccess,
	callPairPreparation
} from 'src/store/slices/competitionSlice'
import { updateCompetitionsListBreakTime, resetCompetitionsListBreakTime } from 'src/store/slices/competitionsSlice'
import { isPast } from 'src/helpers/datetime'

type AlertType = {
	show: boolean
} & AlertPropTypes

export const JudgeCompetitionPage = (): ReactElement => {
	const { competitionId } = useParams()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const competitionDataExisting = useAppSelector(s => s.competitions.data).find(({ _id }) => _id === competitionId)
	const competitionDataFetched = useAppSelector(s => s.competition.data)
	const competitionData = competitionDataExisting || competitionDataFetched
	const judges = useAppSelector(s => competitionId && s.competition.judges[competitionId])
	const participants = useAppSelector(s => competitionId && s.competition.participants[competitionId])
	const dateStart = competitionData && getFormattedDate(competitionData.startDate, 'MMM D, HH:mm')
	const { setBreakTimeSuccess, setBreakTimePending, setBreakTimeError } = useAppSelector(s => s.competition)
	const authorizedUser = useAppSelector(state => state.user.authorizedUser)
	const breakTime = useAppSelector(s => s.competition.data?.breakTime?.minutes)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [breakInterval, setBreakInterval] = useState<number | undefined>()
	const [isTimerOver, setIsTimerOver] = useState(false)
	const [isCallUpTimerOver, setIsCallUpTimerOver] = useState(false)
	const [alertData, setAlertData] = useState<AlertType>({ show: false })

	useEffect(() => {
		if (!competitionDataExisting) {
			dispatch(fetchCompetitionById(competitionId as string))
		} else {
			dispatch(setCompetitionData(competitionDataExisting))
		}
		if (!judges) {
			dispatch(fetchCompetitionJudges(competitionId as string))
		}

		if (!participants) {
			dispatch(fetchCompetitionParticipants(competitionId as string))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (competitionData && !isPast(competitionData.startDate)) {
			navigate(`/${AppRoute.Competitions}/${competitionId}`)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [competitionData])

	useEffect(() => {
		if (setBreakTimeSuccess) {
			setIsModalOpen(false)
			dispatch(setBreakTimeLocalState(breakInterval as number))
			dispatch(resetBreakTimeSuccess())
			dispatch(
				updateCompetitionsListBreakTime({
					breakTimeMinutes: breakInterval as number,
					competitionId: competitionId as string
				})
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setBreakTimeSuccess])

	useEffect(() => {
		if (setBreakTimeError) {
			setAlertData({ show: true, title: 'Set a break failed', subtitle: setBreakTimeError, type: 'error' })
			setTimeout(() => setAlertData({ show: false, subtitle: '' }), 3000)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setBreakTimeError])

	useEffect(() => {
		if (isTimerOver) {
			setIsTimerOver(false)
			dispatch(resetBreakTime())
			dispatch(resetCompetitionsListBreakTime(competitionId as string))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isTimerOver])

	const handleBreakTimeInput = (value?: string) => {
		if (Number(value) > 10) {
			setBreakInterval(10)
			return
		}
		setBreakInterval(Number(value))
	}

	const handleModalShow = () => {
		setBreakInterval(undefined)
		setIsModalOpen(!isModalOpen)
	}

	const handleSetBreakTimeClick = () => {
		if (breakInterval) {
			dispatch(
				setBreakTime({
					breakTimeMinutes: Number(breakInterval),
					id: competitionId as string
				})
			)
		}
	}

	const handleCallPairPreparationClick = (groupId: string, pairId: string) => {
		dispatch(callPairPreparation({ competitionId: competitionId as string, groupId, pairId }))
	}

	const handleCallUpTimer = () => {
		console.log('callup finished');
		setIsCallUpTimerOver(true)
	}

	return (
		<>
			<main className='container relative mx-auto grow px-4 py-8 md:py-9 xl:py-14 xl:pl-[6.5rem] xl:pr-[3.125rem]'>
				<Alert
					title={alertData.title}
					type={alertData.type}
					classes={`fixed -right-56 w-56 transition-[right] duration-300 ${alertData.show && 'right-8'}`}
				/>
				<Link
					to={`/${AppRoute.Competitions}/${competitionId}`}
					className='absolute left-[38px] top-[77px] transition hover:opacity-70'
				>
					<ArrowLeftIcon />
				</Link>
				{competitionData && (
					<>
						<div className='mb-16 grid grid-cols-[1fr_21.6rem] gap-[0_2.5rem]'>
							<div>
								<h1 className='mb-[24px] text-heading-1'>{competitionData.name}</h1>
								<p className='mb-6 text-heading-3 text-grey'>{dateStart}</p>
								<div className='mb-9 flex flex-wrap gap-4'>
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
								<div className='grid grid-cols-[1fr_16.25rem] gap-x-14 gap-y-6'>
									<CompetitionRequirements competitionRequirements={competitionData.requirements} />
									<div className='col-start-2 col-end-3 row-start-1 row-end-3'>
										<h3 className='mb-5 font-bold'>Judges</h3>
										{judges &&
											judges.map(({ fullName, socialNetworks, _id }) => (
												<div className='mb-5 last:mb-0' key={_id}>
													<p className='mb-1.5'>{fullName}</p>
													<a
														href={`https://wa.me/${socialNetworks?.whatsup}`}
														target='_blank'
														rel='noreferrer'
														className='flex items-center gap-3 text-grey transition hover:opacity-70'
													>
														<WhatsappIcon className='w-4 invert-[45%]' />
														{socialNetworks?.whatsup}
													</a>
												</div>
											))}
									</div>
									<div>
										<p className='mb-2 text-[#6C6A6C] xl:font-bold'>Description:</p>
										<p className='mb-9'>{competitionData.description}</p>
									</div>
								</div>
							</div>
							<div>
								<div className='relative mb-9 h-fit rounded-2xl border-2 p-10 text-heading-3'>
									The competition is on!
									<TwoStarsIcon className='absolute top-[7rem] right-[3.5rem] w-10' />
								</div>
								{breakTime && !isTimerOver ? (
									<div className='flex items-center justify-between'>
										<p className='text-heading-2'>Break</p>
										<BreakTimer minutes={breakTime} isTimeOver={setIsTimerOver} />
									</div>
								) : (
									<Button classes='w-full' onClick={handleModalShow}>
										Take a break
									</Button>
								)}
							</div>
						</div>
						<h2 className='mb-[20px] text-xl font-medium md:mb-[34px] xl:text-4xl xl:font-bold'>
							Competition schedule
						</h2>
						{competitionData.groups?.length !== 0 && participants && judges && authorizedUser ? (
							<CompetitionParticipantsTable
								competitionData={competitionData}
								participants={participants}
								judges={judges}
								authorizedUser={authorizedUser}
								isJudgeCompetitionPage
								onCallPairPreparation={handleCallPairPreparationClick}
								onCallUpTimer={handleCallUpTimer}
							/>
						) : (
							<Loader />
						)}
					</>
				)}
			</main>
			<Modal
				isOpen={isModalOpen}
				onClose={handleModalShow}
				title='Break'
				classes='max-w-[34rem]'
				content={
					<>
						<div className='mb-4 flex items-center gap-2.5'>
							<WarniniIcon />
							<p>You can take a break, only between matches</p>
						</div>
						<div className='mb-8 flex items-center gap-2.5'>
							<p className='text-heading-6'>Minutes:</p>
							<Input
								onChange={handleBreakTimeInput}
								type='number'
								classes='w-[8.625rem]'
								placeholder='0-10 minutes'
								value={breakInterval?.toString()}
								autoFocus
							/>
						</div>
						<div className='flex gap-2.5'>
							<Button
								onClick={handleSetBreakTimeClick}
								classes='w-full'
								disabled={!Boolean(breakInterval) || setBreakTimePending}
								loading={setBreakTimePending}
							>
								Done
							</Button>
							<Button onClick={handleModalShow} type='outlined' classes='w-full'>
								Cancel
							</Button>
						</div>
					</>
				}
			/>
		</>
	)
}
