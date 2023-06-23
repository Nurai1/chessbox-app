import { FC } from 'react'
import { ReactComponent as Banknote } from 'assets/banknote.svg'
import { ReactComponent as Persons } from 'assets/persons.svg'
import { ReactComponent as ThreeStars } from 'assets/three-stars.svg'
import { ReactComponent as TwoStars } from 'assets/two-stars.svg'
import { ReactComponent as Hourglass } from 'assets/hourglass.svg'
import { ReactComponent as Place } from 'assets/place.svg'
import { Button, Timer, Tag } from '../../ui'
import { Competition } from '../../types'
import { getFormattedDate } from '../../helpers/datetime'
import style from './CompetitionCard.module.css'

type CompetitionPropsType = {
	competition: Competition
	isParticipant: boolean
}

const screenWidth = document.documentElement.clientWidth

export const CompetitionCard: FC<CompetitionPropsType> = ({ competition, isParticipant }) => {
	const handleClick = () => {}
	const startDate = getFormattedDate(competition.startDate, 'MMM D, HH:mm')
	const participantsNumber = competition.participants.length
	const isRegistrationClosed = new Date(competition.registrationEndsAt).getTime() < new Date().getTime()
	const isOver = new Date(competition.endDate).getTime() < new Date().getTime()

	const participateMobile = () =>
		screenWidth < 744 &&
		!isRegistrationClosed &&
		!isParticipant &&
		!isOver && (
			<Button onClick={handleClick} classes='w-full mt-[17px] md:mt-[12px]'>
				Participate
			</Button>
		)

	const participateDesktop = () =>
		screenWidth > 743 &&
		!isRegistrationClosed &&
		!isParticipant &&
		!isOver && (
			<div
				className='mb-[17px] flex items-center
				lg:col-start-2 lg:col-end-3 lg:mb-0 lg:max-w-[190px] lg:max-w-[250px] lg:flex-col
				lg:items-start xl:col-start-3 xl:col-end-4'
			>
				<h3
					className='mr-1 text-[#6C6A6C]
					lg:mb-3
					xl:mb-4 xl:text-2xl xl:font-semibold'
				>
					Registration ends in:
				</h3>
				<Timer time={competition.registrationEndsAt} classes='lg:mb-[20px] 2xl:mb-[26px]' />
				{screenWidth >= 744 && (
					<Button onClick={handleClick} classes='w-full'>
						Participate
					</Button>
				)}
			</div>
		)

	const participantMobile = () =>
		screenWidth < 744 &&
		isParticipant &&
		!isOver && (
			<Button type='outlined' onClick={handleClick} classes='w-full mt-[17px] md:mt-[12px] pointer-events-none'>
				You are participant!
			</Button>
		)

	const participantDesktop = () =>
		screenWidth > 743 &&
		isParticipant &&
		!isOver && (
			<div
				className='relative h-[103px] w-[190px] rounded-3xl border border-[#DADADA] px-[17px] pt-[39px] pb-[16px]
				pl-[22px] xl:h-[133px] xl:w-[229px] xl:px-[23px]
				xl:pt-[42px] 2xl:h-[150px] 2xl:w-[275px] 2xl:pt-12 2xl:pb-2 2xl:pb-[29px] 2xl:pr-[50px]'
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
					className='2xl:h-[37px absolute top-[24px] left-[136px] h-[26px]
					w-[24px] xl:top-[34px] xl:left-[180px] xl:h-[32px]
					xl:w-[30px] 2xl:left-[192px] 2xl:w-[34px]'
				/>
				<TwoStars
					className='absolute top-[66px] left-[121px] h-[22px] w-[23px]
					xl:top-[84px] xl:left-[171px] xl:h-[26px] xl:w-[27px]
					2xl:top-[96px] 2xl:left-[180px] 2xl:h-[30px] 2xl:w-[31px]'
				/>
			</div>
		)

	const registrationClosedMobile = () =>
		screenWidth < 744 &&
		isRegistrationClosed &&
		!isOver &&
		!isParticipant && (
			<Button type='outlined' onClick={handleClick} classes='w-full mt-[17px] md:mt-[12px] pointer-events-none'>
				Registration closed
			</Button>
		)

	const registrationClosedDesktop = () =>
		screenWidth > 743 &&
		isRegistrationClosed &&
		!isOver &&
		!isParticipant && (
			<div
				className='relative h-[103px] w-[190px] rounded-3xl border border-[#DADADA] px-[27px] pt-[17px] pb-2
				xl:h-[133px] xl:w-[229px] xl:px-[22px] xl:pt-[21px] xl:pb-2
				2xl:h-[150px] 2xl:w-[275px] 2xl:pt-[26px] 2xl:pr-[50px]'
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
		screenWidth < 744 &&
		isOver && (
			<Button type='outlined' onClick={handleClick} classes='w-full mt-[17px] md:mt-[12px] pointer-events-none'>
				This competition is over
			</Button>
		)

	const competitionOverDesktop = () =>
		screenWidth > 743 &&
		isOver && (
			<div
				className='relative h-[103px] w-[190px] rounded-3xl border border-[#DADADA] px-[27px] pt-[15px] pb-2
				xl:h-[133px] xl:w-[229px] xl:px-[22px] xl:pt-[18px] xl:pb-2
				2xl:h-[150px] 2xl:w-[275px] 2xl:pt-[22px] 2xl:pr-[50px]'
			>
				<h3 className='mb-1 text-base font-normal text-black xl:text-2xl xl:font-semibold'>This competition is over</h3>
				<span className='text-sm text-[#6C6A6C]'>Your place 15</span>
				<Place
					className='absolute top-[52px] left-[137px] h-[26px] w-[26px]
					xl:top-[73px] xl:left-[162px]
					2xl:top-[80px] 2xl:left-[205px] 2xl:h-[39px] 2xl:w-[39px]'
				/>
			</div>
		)

	return (
		<article
			className='pt-[20px] pb-[30px] lg:grid lg:grid-cols-[auto_190px]
		lg:gap-[25px] lg:pt-[25px] xl:grid-cols-[44%_27%_250px] xl:gap-[20px]
		xl:px-[23px] xl:py-[41px] 2xl:px-[26px] 2xl:pt-[68px]
		 2xl:pb-[44px] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-b-[#DADADA]'
		>
			<div
				className='lg:col-start-1 lg:col-end-3
			xl:col-start-auto xl:col-end-auto'
			>
				<h2
					className='mb-[17px] text-[20px] font-medium text-black
				lg:mb-0
				xl:text-4xl xl:font-bold
				2xl:mb-[22px]'
				>
					{competition.name}
				</h2>
				{screenWidth < 744 && (
					<p className='mb-[17px] text-sm text-[#6C6A6C] xl:text-lg xl:font-medium'>Starts At {startDate}</p>
				)}
				{screenWidth > 1199 && (
					<p className='mb-[17px] text-sm text-[#6C6A6C] xl:text-lg xl:font-medium'>Starts At {startDate}</p>
				)}
				{screenWidth > 1199 && (
					<div className='mt-4 flex flex-wrap gap-4 '>
						<Tag img={<Banknote className='max-5 mr-2' />} text={competition.price} />
						<Tag
							img={<Persons className='max-5 mr-2' />}
							text={`${participantsNumber} participant${participantsNumber === 1 ? '' : 's'} enrolled`}
						/>
					</div>
				)}
			</div>
			{participateDesktop()}
			{participantDesktop()}
			{registrationClosedDesktop()}
			{competitionOverDesktop()}
			<div
				className='lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3
			 xl:col-start-2 xl:col-end-3 xl:row-start-1 xl:row-end-2'
			>
				{screenWidth > 743 && screenWidth < 1200 && (
					<p className='mb-[17px] text-sm text-[#6C6A6C]'>Starts At {startDate}</p>
				)}
				<p className={`${style['competition-card_text-col-limit']} text-[#3A3A40]`}>{competition.description}</p>
				{screenWidth < 1200 && (
					<div className='mt-4 flex flex-wrap gap-4 '>
						<Tag img={<Banknote className='max-5 mr-2' />} text='Price: 15 $' />
						<Tag
							img={<Persons className='max-5 mr-2' />}
							text={`${participantsNumber} participant${participantsNumber === 1 ? '' : 's'} enrolled`}
						/>
					</div>
				)}
				{participateMobile()}
				{participantMobile()}
				{registrationClosedMobile()}
				{competitionOverMobile()}
			</div>
		</article>
	)
}
