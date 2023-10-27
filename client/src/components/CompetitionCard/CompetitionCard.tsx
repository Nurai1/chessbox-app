import { FC } from 'react'
import { useWindowSize } from 'usehooks-ts'
import { ReactComponent as Banknote } from 'src/assets/banknote.svg'
import { ReactComponent as Persons } from 'src/assets/persons.svg'
import { ReactComponent as ThreeStars } from 'src/assets/three-stars.svg'
import { ReactComponent as TwoStars } from 'src/assets/two-stars.svg'
import { ReactComponent as Hourglass } from 'src/assets/hourglass.svg'
import { ReactComponent as Place } from 'src/assets/place.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector } from 'src/hooks/redux'
import { CompetitionSchema } from 'src/types'
import { Button, Timer, Tag } from 'src/ui'
import { getFormattedDate, isPast } from 'src/helpers/datetime'
import { BreakPoint } from 'src/constants/breakPoints'
import { Role } from 'src/constants/role'
import { AppRoute } from 'src/constants/appRoute'
import style from './CompetitionCard.module.css'

type CompetitionPropsType = {
	competition: CompetitionSchema
}

export const CompetitionCard: FC<CompetitionPropsType> = ({
	competition: { startDate, registrationEndsAt, endDate, name, price, description, participants, _id }
}) => {
	const authorizedUser = useAppSelector(state => state.user.authorizedUser)
	const navigate = useNavigate()
	const dateStart = getFormattedDate(startDate, 'MMM D, HH:mm')
	const isRegistrationClosed = isPast(registrationEndsAt)
	const isOver = Boolean(endDate)
	const isParticipant = participants?.includes(authorizedUser?._id ?? '')
	const { width: screenWidth } = useWindowSize()

	const handleParticipateClick = () => {
		if (!authorizedUser) {
			navigate(`/${AppRoute.SignIn}`)
		} else {
			// eslint-disable-next-line no-console
			console.log('participate')
		}
	}

	const participate = () =>
		!isRegistrationClosed &&
		!isParticipant &&
		!isOver && (
			<div
				className='mt-6 w-full
				lg:col-start-2 lg:col-end-3 lg:mb-0  lg:flex-col
				lg:items-start xl:col-start-3 xl:col-end-4'
			>
				<h3
					className='mr-1 text-grey
					lg:mb-3
					xl:mb-4 xl:text-2xl xl:font-semibold'
				>
					Registration ends in:
				</h3>
				<Timer time={registrationEndsAt} classes='lg:mb-[20px] 2xl:mb-[26px]' countLabelsClasses='text-grey' />
				{screenWidth >= BreakPoint.Lg && authorizedUser?.role !== Role.ChiefJudge && (
					<Button onClick={handleParticipateClick} classes='w-full'>
						Participate
					</Button>
				)}
			</div>
		)

	const participantMobile = () =>
		screenWidth < BreakPoint.Lg &&
		isParticipant &&
		!isOver && (
			<Button type='outlined' onClick={() => ''} classes='w-full mt-[17px] md:mt-[12px] pointer-events-none'>
				You are participant!
			</Button>
		)

	const participantDesktop = () =>
		screenWidth >= BreakPoint.Lg &&
		isParticipant &&
		!isOver && (
			<div
				className='relative min-h-[103px] w-[190px] self-center rounded-3xl border border-[#DADADA] pl-[17px] pr-[64px] pt-[39px] pb-[16px]
				xl:min-h-[133px] xl:w-[229px] xl:pl-[22px] xl:pr-[55px] xl:pt-[42px]
				2xl:min-h-[150px] 2xl:w-[275px] 2xl:pt-12 2xl:pb-[29px] 2xl:pr-[50px]'
			>
				<h3
					className='text-base text-black
					xl:text-2xl xl:font-semibold'
				>
					You are participant!
				</h3>
				<ThreeStars
					className='absolute top-[15px] left-[80px] h-[26px] w-[24px]
					xl:top-[20px] xl:left-[121px] xl:h-[32px] xl:w-[30px]
					2xl:left-[114px] 2xl:h-[37px] 2xl:w-[34px]'
				/>
				<ThreeStars
					className='2xl:h-[37px absolute top-[24px] left-[136px] h-[26px] w-[24px]
					xl:top-[34px] xl:left-[180px] xl:h-[32px] xl:w-[30px]
					2xl:left-[192px] 2xl:h-[37px] 2xl:w-[34px]'
				/>
				<TwoStars
					className='absolute top-[66px] left-[121px] h-[22px] w-[23px]
					xl:top-[84px] xl:left-[171px] xl:h-[26px] xl:w-[27px]
					2xl:top-[96px] 2xl:left-[180px] 2xl:h-[30px] 2xl:w-[31px]'
				/>
			</div>
		)

	const registrationClosedMobile = () =>
		screenWidth < BreakPoint.Lg &&
		isRegistrationClosed &&
		!isOver &&
		!isParticipant && (
			<Button type='outlined' onClick={() => ''} classes='w-full mt-[17px] md:mt-[12px] pointer-events-none'>
				Registration closed
			</Button>
		)

	const registrationClosedDesktop = () =>
		screenWidth >= BreakPoint.Lg &&
		isRegistrationClosed &&
		!isOver &&
		!isParticipant && (
			<div
				className='relative min-h-[103px] w-[190px] self-center rounded-3xl border border-[#DADADA] pl-[27px] pr-[55px] pt-[17px] pb-2
				xl:min-h-[133px] xl:w-[229px] xl:pt-[21px] xl:pb-2 xl:pl-[22px] xl:pr-[55px]
				2xl:min-h-[150px] 2xl:w-[275px] 2xl:pt-[26px] 2xl:pr-[70px]'
			>
				<h3 className='text-base font-normal text-black xl:text-2xl xl:font-semibold'>Registration closed</h3>
				<Hourglass
					className='absolute top-[52px] left-[132px] h-[28px] w-[23px]
					xl:top-[73px] xl:left-[162px]
					2xl:top-[80px] 2xl:left-[205px] 2xl:h-[38px] 2xl:w-[31px]'
				/>
			</div>
		)

	const competitionOverMobile = () =>
		screenWidth < BreakPoint.Lg &&
		isOver && (
			<Button type='outlined' onClick={() => ''} classes='w-full mt-[17px] md:mt-[12px] pointer-events-none'>
				This competition is&nbsp;over
			</Button>
		)

	const competitionOverDesktop = () =>
		screenWidth >= BreakPoint.Lg &&
		isOver && (
			<div
				className='relative min-h-[103px] w-[190px] self-center rounded-3xl border border-[#DADADA] px-[27px] pt-[15px] pb-2
				xl:min-h-[133px] xl:w-[229px] xl:px-[22px] xl:pt-[18px] xl:pb-2
				2xl:min-h-[150px] 2xl:w-[275px] 2xl:pt-[22px] 2xl:pr-[50px]'
			>
				<h3 className='mb-1 text-base font-normal text-black xl:mb-[13px] xl:text-2xl xl:font-semibold'>
					This competition is&nbsp;over
				</h3>
				<span className='text-sm text-grey'>Your place 15</span>
				<Place
					className='absolute top-[52px] left-[137px] h-[26px] w-[26px]
					xl:top-[73px] xl:left-[175px]
					2xl:top-[77px] 2xl:left-[205px] 2xl:h-[39px] 2xl:w-[39px]'
				/>
			</div>
		)

	return (
		<article
			className='pt-[20px] pb-[30px] lg:grid lg:grid-cols-[auto_14.25rem]
		lg:gap-[25px] lg:pt-[25px] xl:grid-cols-[44%_27%_18.75rem] xl:gap-[20px]
		xl:px-[23px] xl:py-[41px] 2xl:px-[26px] 2xl:pt-[68px]
		 2xl:pb-[44px] 2xl:grid-cols-[44%_27%_15.625rem] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-b-[#DADADA]'
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
					<p className='mb-[17px] text-sm text-grey xl:text-lg xl:font-medium'>Starts At {dateStart}</p>
				)}
				{screenWidth >= BreakPoint.Xl && (
					<p className='mb-[17px] text-sm text-grey xl:text-lg xl:font-medium'>Starts At {dateStart}</p>
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
			{screenWidth >= BreakPoint.Lg && participate()}
			{participantDesktop()}
			{registrationClosedDesktop()}
			{competitionOverDesktop()}
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
				{screenWidth < BreakPoint.Lg && participate()}
				{participantMobile()}
				{registrationClosedMobile()}
				{competitionOverMobile()}
			</div>
		</article>
	)
}
