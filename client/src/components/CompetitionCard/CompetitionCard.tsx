import { FC } from 'react'
import { ReactComponent as Banknote } from 'assets/banknote.svg'
import { ReactComponent as Persons } from 'assets/persons.svg'
import { ReactComponent as ThreeStars } from 'assets/three-stars.svg'
import { ReactComponent as TwoStars } from 'assets/two-stars.svg'
import { ReactComponent as Hourglass } from 'assets/hourglass.svg'
import { Button, Timer, Tag } from '../../ui'

type ButtonPropsType = {
	isEventOver?: boolean
	isParticipant?: boolean
	registrationClosed?: boolean
}

export const CompetitionCard: FC<ButtonPropsType> = ({ isEventOver, isParticipant, registrationClosed }) => {
	const handleClick = () => {
		return null
	}

	return (
		<article className='grid grid-cols-[37%_33%_22%] gap-[4%] px-[26px] pt-[68px] pb-[44px] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-b-[#DADADA]'>
			<div>
				<h2 className='mb-[22px] text-4xl font-bold'>World Competition of Chessboxing June 2024</h2>
				<p className='text-xl text-[#6C6A6C]'>Starts At June 17, 19:00</p>
			</div>
			<div>
				<p
					className='mb-4 text-[#6C6A6C]'
					style={{
						display: '-webkit-box',
						WebkitLineClamp: 4,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden'
					}}
				>
					The best competition in sport ever. Feel how stronger you become. Come and train your brain and muscles. Lorem
					ipsum delorian van fin uptinum. Lorem ipsum delorian van fin uptinum. Lorem ipsum delorian van fin uptinum.
					Lorem ipsum delorian van fin uptinum.
				</p>
				<div className='flex flex-wrap gap-4'>
					<Tag img={<Banknote className='max-5 mr-2' />} text='Price: 15 $' />
					<Tag img={<Persons className='max-5 mr-2' />} text='426 participants enrolled' />
				</div>
			</div>
			{!isEventOver && !isParticipant && !registrationClosed && (
				<div>
					<h3 className='mb-4 text-2xl font-semibold text-[#6C6A6C]'>Registration ends in:</h3>
					<Timer time='2023-06-29T07:39:00.000Z' classes='mb-[26px]' />
					<Button onClick={handleClick} classes='w-full'>
						Participate
					</Button>
				</div>
			)}
			{isParticipant && (
				<div className='relative rounded-3xl border border-[#DADADA] pt-12 pb-2 pl-[22px] pr-[50px]'>
					<h3 className='text-2xl font-semibold'>You are participant!</h3>
					<ThreeStars className='absolute top-[20px] left-[114px]' />
					<ThreeStars className='absolute top-[34px] left-[192px]' />
					<TwoStars className='absolute top-[96px] left-[180px]' />
				</div>
			)}
			{registrationClosed && (
				<div className='relative rounded-3xl border border-[#DADADA] pt-[26px] pb-2 pl-[22px] pr-[50px]'>
					<h3 className='text-2xl font-semibold'>Registration closed</h3>
					<Hourglass className='absolute top-[80px] left-[205px]' />
				</div>
			)}
		</article>
	)
}
