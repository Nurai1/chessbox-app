import { FC } from 'react'
import { useWindowSize } from 'usehooks-ts'
import { ReactComponent as Banknote } from 'src/assets/banknote.svg'
import { ReactComponent as Persons } from 'src/assets/persons.svg'
import { ReactComponent as Hourglass } from 'src/assets/hourglass.svg'
import { ReactComponent as Place } from 'src/assets/place.svg'
import { Link } from 'react-router-dom'
import { useAppSelector } from 'src/hooks/redux'
import { CompetitionSchema } from 'src/types'
import { Tag } from 'src/ui'
import { getFormattedDate, isPast } from 'src/helpers/datetime'
import { BreakPoint } from 'src/constants/breakPoints'
import style from 'src/components/CompetitionCard/CompetitionCard.module.css'
import {
	RegistrationEndsTimer,
	CompetitionInfo,
	YouAreParticipant,
	CompetitionCardTimer,
	RequestAwaitAcception
} from 'src/components'
import { Role } from 'src/constants/role'

type CompetitionPropsType = {
	competition: CompetitionSchema
}

export const CompetitionCard: FC<CompetitionPropsType> = ({ competition }) => {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { startDate, registrationEndsAt, endDate, name, price, description, participants, _id } = competition
	const { authorizedUser } = useAppSelector(state => state.user)
	const dateStart = getFormattedDate(startDate, 'MMM D, HH:mm')
	const isRegistrationClosed = isPast(registrationEndsAt)
	const isCompetitionOver = Boolean(endDate)
	const isParticipant = participants?.includes(authorizedUser?._id ?? '')
	const { width: screenWidth } = useWindowSize()
	const calledForPreparation = !!competition.groups?.find(group => {
		return group.currentRoundPairs?.find(pair => {
			if (
				(pair.blackParticipant === authorizedUser?._id && pair.calledForPreparation) ||
				(pair.whiteParticipant === authorizedUser?._id && pair.calledForPreparation)
			) {
				return true
			}
			return false
		})
	})

	const yourPlace = authorizedUser?.competitionsHistory?.find(
		competitionData => competitionData.competitionId === _id
	)?.placeNumber

	const currentUserRequestData =
		competition && competition.usersPaymentInfo?.find(paymentInfo => paymentInfo.userId === authorizedUser?._id)

	const showRegistrationEndsTimer =
		!isRegistrationClosed && !isParticipant && !isCompetitionOver && !currentUserRequestData
	const timeBeforeStart =
		(isRegistrationClosed && isParticipant && !calledForPreparation && !isCompetitionOver) ||
		(isRegistrationClosed && !isCompetitionOver && authorizedUser?.role === Role.ChiefJudge)
	const registrationClosed =
		!isCompetitionOver && isRegistrationClosed && !isParticipant && authorizedUser?.role !== Role.ChiefJudge
	const showYouAreParticipant = isParticipant && !isCompetitionOver && !isRegistrationClosed
	const requestAwaitAcception = !isParticipant && currentUserRequestData

	return (
		<article
			className='grid gap-4 pt-5 pb-[1.875rem] lg:grid-cols-[auto_18.25rem]
		lg:gap-[25px] lg:pt-[25px] xl:grid-cols-[37%_32%_17.3rem] xl:gap-7
		xl:px-[23px] xl:py-[41px] 2xl:px-[26px]
		 2xl:pt-[68px] 2xl:pb-[44px] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-b-[#DADADA]'
		>
			<div
				className='lg:col-start-1 lg:col-end-3
			xl:col-start-auto xl:col-end-auto'
			>
				<h2 className='mb-[17px] text-heading-6 lg:mb-0 xl:mb-[22px] xl:text-heading-2'>
					<Link to={_id as string} className='transition hover:opacity-70'>
						{name}
					</Link>
				</h2>
				{screenWidth < BreakPoint.Lg && (
					<p className='text-sm text-grey xl:text-lg xl:font-medium'>Starts At {dateStart}</p>
				)}
				{screenWidth >= BreakPoint.Xl && (
					<div className='mt-4 flex flex-wrap gap-4 '>
						{price?.currentValue && <Tag img={<Banknote className='max-5 mr-2' />} text={price.currentValue} />}
						{participants && (
							<Tag
								img={<Persons className='max-5' />}
								text={`${participants.length} participant${participants.length === 1 ? '' : 's'} enrolled`}
							/>
						)}
					</div>
				)}
			</div>
			<div
				className='lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3
			 xl:col-start-2 xl:col-end-3 xl:row-start-1 xl:row-end-2'
			>
				{screenWidth > 743 && screenWidth < BreakPoint.Xl && (
					<p className='mb-[17px] text-sm text-grey'>Starts At {dateStart}</p>
				)}
				<p className={`${style['competition-card_text-col-limit']} text-[#3A3A40]`}>{description}</p>
				{screenWidth < BreakPoint.Xl && (
					<div className='mt-4 flex flex-wrap gap-4 '>
						{price?.currentValue && <Tag img={<Banknote className='max-5 mr-2' />} text={price.currentValue} />}
						{participants && (
							<Tag
								img={<Persons className='max-5 mr-2' />}
								text={`${participants.length} participant${participants.length === 1 ? '' : 's'} enrolled`}
							/>
						)}
					</div>
				)}
			</div>
			{showRegistrationEndsTimer && <RegistrationEndsTimer competitionData={competition} />}
			{requestAwaitAcception && <RequestAwaitAcception />}
			{showYouAreParticipant && <YouAreParticipant />}
			{registrationClosed && (
				<CompetitionInfo
					title={<p className='lg:w-40'>Registration closed</p>}
					img={<Hourglass className='h-7 w-7 lg:absolute lg:bottom-6 lg:right-6 lg:h-[2.375rem] lg:w-[2.375rem]' />}
					classes='lg:max-h-[9.375rem]'
				/>
			)}
			{isCompetitionOver && (
				<CompetitionInfo
					title={<p className='lg:w-[13rem]'>This competition is&nbsp;over</p>}
					img={<Place className='h-7 w-7 lg:absolute lg:bottom-6 lg:right-6 lg:h-[2.375rem] lg:w-[2.375rem]' />}
					classes='lg:max-h-[9.375rem]'
					place={yourPlace}
				/>
			)}
			{timeBeforeStart && (
				<CompetitionCardTimer
					competitionData={competition}
					title={<span>Approximate time start&nbsp;before&nbsp;match:</span>}
					classes='mt-2'
				/>
			)}
		</article>
	)
}
