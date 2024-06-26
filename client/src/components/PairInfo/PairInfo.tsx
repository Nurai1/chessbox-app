import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { ReactComponent as WhatsappIcon } from 'src/assets/whatsapp.svg'
import { ReactComponent as RookWhite } from 'src/assets/rook-white.svg'
import { ReactComponent as RookBlack } from 'src/assets/rook-black.svg'
import { ReactComponent as Dumbbell } from 'src/assets/dumbbell.svg'
import { PairType } from 'src/helpers/tableSchemas/tableSchemaJudgeToPairs'
import { getAge } from 'src/helpers/datetime'

type MatchInfoPropsType = {
	pairData?: PairType
	zoomLink?: string
	classes?: string
	// eslint-disable-next-line react/no-unused-prop-types
	startTime?: string
}

export const PairInfo: FC<MatchInfoPropsType> = ({
	pairData,
	zoomLink,
	//  startTime,
	classes
}) => {
	return (
		<div
			className={twMerge(
				'rounded-3xl border border-[#DADADA] p-[20px_15px] md:p-[20px_30px] lg:flex lg:flex-row-reverse lg:gap-x-8 lg:p-[25px_25px_35px_25px] xl:p-[40px_40px_60px_40px]',
				classes
			)}
		>
			<div className='mb-[17px] lg:ml-auto lg:mb-0 lg:w-[30%]'>
				{/* <div className='mb-[5px]'>
					<span className='font-bold xl:text-4xl'>{startTime}</span>
					<span className='font-bold lg:mt-[6px] lg:block lg:text-xs lg:font-normal lg:text-[#6C6A6C] xl:text-2xl xl:font-semibold'>
						{' '}
						({localTZName})
					</span>
				</div> */}
				<a
					className='mb-[6px] inline-block font-medium underline transition hover:opacity-70 xl:mb-[18px] xl:text-2xl xl:font-semibold'
					href={zoomLink}
					target='_blank'
					rel='noreferrer'
				>
					Link to Zoom
				</a>
				<p className='mb-[6px] text-xs text-[#6C6A6C] xl:text-2xl xl:font-semibold'>
					Judge: {pairData?.judgeData?.fullName ?? '—'}
				</p>
				{pairData?.judgeData?.socialNetworks?.whatsup && (
					<a
						className='inline-flex items-center gap-[10px] text-xs text-[#6C6A6C] transition hover:opacity-70 xl:text-2xl xl:font-semibold'
						href={`https://wa.me/${pairData?.judgeData?.socialNetworks?.whatsup}`}
					>
						{pairData?.judgeData?.socialNetworks?.whatsup}
						<WhatsappIcon className='xl:min-w-9 h-[0.8125rem] w-[0.8125rem] lg:h-[1.125rem] lg:min-w-[1.125rem] xl:h-9' />
					</a>
				)}
			</div>
			<div className='flex gap-x-3 overflow-hidden lg:w-[60%] lg:gap-x-6'>
				<div className='flex w-[45%] flex-col'>
					{!pairData?.whiteParticipantData && <span className='font-bold xl:text-4xl'>Unknown</span>}
					<span className='font-bold xl:text-4xl'>{pairData?.whiteParticipantData?.firstName}</span>
					<span className='block text-[#6C6A6C] md:inline md:font-bold md:text-black lg:block xl:text-4xl'>
						{' '}
						{pairData?.whiteParticipantData?.lastName}
					</span>
					<a
						href={`https://lichess.org/@/${pairData?.whiteParticipantData?.chessPlatform?.username}`}
						className={twMerge(
							'mt-[16px] mb-[6px] flex items-center gap-[9px] font-medium transition hover:opacity-70 lg:mt-auto xl:mb-[10px] xl:text-2xl xl:font-semibold',
							pairData?.whiteParticipantData?.chessPlatform?.username && 'underline'
						)}
						target='_blank'
						rel='noreferrer'
					>
						<RookWhite className='min-w-[1rem] xl:h-[34px] xl:min-w-[31px]' />
						<div className='truncate'>{pairData?.whiteParticipantData?.chessPlatform?.username ?? '—'}</div>
					</a>
					<p className='flex w-fit items-center gap-[11px] text-xs text-[#6C6A6C] xl:text-2xl xl:font-semibold'>
						<Dumbbell className='xl:h-[34px] xl:min-w-[34px]' />
						{pairData?.whiteParticipantData?.birthDate && pairData?.whiteParticipantData?.weight
							? `${getAge(pairData?.whiteParticipantData?.birthDate)} age, ${pairData?.whiteParticipantData?.weight} kg`
							: '—'}
					</p>
				</div>
				<span className='mx-[2%] w-[6%] font-bold xl:text-4xl'>VS</span>
				<div className='w-[45%]'>
					<div className='ml-auto flex h-full flex-col'>
						{!pairData?.blackParticipantData && <span className='font-bold xl:text-4xl'>Unknown</span>}
						<span className='font-bold lg:block xl:text-4xl'>{pairData?.blackParticipantData?.firstName}</span>
						<span className='block text-[#6C6A6C] md:inline md:font-bold md:text-black xl:text-4xl'>
							{' '}
							{pairData?.blackParticipantData?.lastName}
						</span>
						<a
							href={`https://lichess.org/@/${pairData?.blackParticipantData?.chessPlatform?.username}`}
							className={twMerge(
								'mt-[16px] mb-[6px] flex items-center gap-[9px] font-medium transition hover:opacity-70 lg:mt-auto xl:mb-[10px] xl:text-2xl xl:font-semibold',
								pairData?.whiteParticipantData?.chessPlatform?.username && 'underline'
							)}
							target='_blank'
							rel='noreferrer'
						>
							<RookBlack className='min-w-[1rem] xl:h-[34px] xl:min-w-[31px]' />
							<div className='truncate'>{pairData?.blackParticipantData?.chessPlatform?.username ?? '—'}</div>
						</a>
						<p className='flex w-fit items-center gap-[11px] text-xs text-[#6C6A6C] xl:text-2xl xl:font-semibold'>
							<Dumbbell className='xl:h-[34px] xl:min-w-[34px]' />
							{getAge(pairData?.blackParticipantData?.birthDate)} age, {pairData?.blackParticipantData?.weight} kg
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
