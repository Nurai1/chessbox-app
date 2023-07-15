import { ReactElement, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ReactComponent as Banknote } from 'src/assets/banknote.svg'
import { ReactComponent as Persons } from 'src/assets/persons.svg'
import { ReactComponent as ArrowLeft } from 'src/assets/arrow-left.svg'
import { ReactComponent as ThreeStars } from 'src/assets/three-stars.svg'
import { ReactComponent as TwoStars } from 'src/assets/two-stars.svg'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchCompetitionById, fetchCompetitionParticipants } from '../store/slices/competitionSlice'
import { Loader, Tag, Timer, Button, Modal, TableBody } from '../ui'
import { getFormattedDate, isPast } from '../helpers/datetime'
import { AppRoute } from '../constants/appRoute'
import { authorizedUserId } from '../mock/authorizedUserId'
import { tableSchemaParticipants } from '../helpers/tableSchemaParticipants'

export const CompetitionPage = (): ReactElement => {
	const dispatch = useAppDispatch()
	const { competitionId } = useParams()
	const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
	const competitionDataExisting = useAppSelector(s => s.competitions.data).find(({ _id }) => _id === competitionId)
	const competitionDataFetched = useAppSelector(s => s.competition.data)
	const fetchError = useAppSelector(s => s.competition.error)
	const participants = useAppSelector(s => competitionId && s.competition.participants[competitionId])
	const competitionData = competitionDataExisting || competitionDataFetched
	const dateStart = competitionData && getFormattedDate(competitionData.startDate, 'MMM D, HH:mm')
	const isParticipant = competitionData?.participants && competitionData.participants.includes(authorizedUserId)
	const isRegistrationClosed = competitionData && isPast(competitionData.registrationEndsAt)
	const isOver = competitionData && Boolean(competitionData.endDate)
	const participantsTable = participants && tableSchemaParticipants(participants)

	useEffect(() => {
		// dispatch(clearParticipants())
		if (!competitionDataExisting) {
			dispatch(fetchCompetitionById(competitionId as string))
		}
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (!participants && isSideMenuOpen) {
			dispatch(fetchCompetitionParticipants(competitionId as string))
		}
		// eslint-disable-next-line
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
					<h3 className='mr-[8px] text-sm text-[#6C6A6C] lg:text-base xl:text-[32px] xl:font-semibold xl:leading-[48px]'>
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
		!isOver && (
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

	return (
		<>
			<main className='container relative mx-auto grow px-[17px] pt-[30px] md:pt-[38px] xl:pl-[103px] xl:pr-[50px] xl:pt-[55px]'>
				<Link
					to={`/${AppRoute.Competitions}`}
					className='hidden transition hover:opacity-70 xl:absolute xl:left-[38px] xl:top-[77px] xl:block'
				>
					<ArrowLeft />
				</Link>
				{!competitionData && !fetchError && <Loader />}
				{fetchError && <h2>{fetchError}</h2>}
				{competitionData && (
					<div className='lg:grid lg:grid-cols-[1fr_190px] lg:gap-[0_15px] xl:grid-cols-[1fr_345px] xl:gap-[0_40px]'>
						<div>
							<h1 className='mb-[15px] text-2xl font-semibold lg:mb-[10px] xl:mb-[24px] xl:text-[54px] xl:font-bold xl:leading-[81px]'>
								{competitionData.name}
							</h1>
							<p className='lg-[mb-[10px] mb-[15px] text-sm text-[#6C6A6C] xl:mb-[24px] xl:text-[32px] xl:font-medium xl:leading-[48px]'>
								{dateStart}
							</p>
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
							{competitionData.groups?.map(({ _id, ageCategory, weightCategory }) => (
								<div key={_id} className='mb-[24px] flex items-center'>
									<p className='max-w-[150px] pr-[16px] text-[#6C6A6C] xl:font-bold'>Competition requirements:</p>
									<div className='min-w-[112px] border-x px-[16px]'>
										<p className='mb-[8px] text-sm xl:text-base'>Age:</p>
										<p className='whitespace-nowrap font-bold'>
											{ageCategory?.from} - {ageCategory?.to}{' '}
										</p>
									</div>
									<div className='min-w-[100px] pl-[16px]'>
										<p className='mb-[8px] text-sm xl:text-base'>Weight:</p>
										<p className='whitespace-nowrap font-bold'>
											{weightCategory?.from} - {weightCategory?.to}
											<span className='text-[#6C6A6C]'> kg</span>
										</p>
									</div>
								</div>
							))}
						</div>
						{participate()}
						{participant()}

						<div>
							<p className='mb-[8px] text-[#6C6A6C] xl:font-bold'>Description:</p>
							<p className='mb-[24px] text-sm'>{competitionData.description}</p>
							<Link to='/' className='font-medium underline xl:text-2xl xl:font-semibold'>
								Read Regulations
							</Link>
						</div>
					</div>
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
						{participants?.length === 0 && <p>No participants yet</p>}
						{participantsTable && <TableBody rows={participantsTable} />}
					</>
				}
			/>
		</>
	)
}
