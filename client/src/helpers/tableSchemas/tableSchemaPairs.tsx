import { MutableRefObject } from 'react'
import { ReactComponent as WhatsappIcon } from 'src/assets/whatsapp.svg'
import { CompetitionSchema, PairSchema, UserSchema } from 'src/types'
import { getAge, localTZName } from 'src/helpers/datetime'

export const getTimeTuplePlusMinutes = (startTimeTuple: string[] | null, minutesPassed: number) => {
	const [hours, minutes] = startTimeTuple?.map(Number) ?? []
	const hoursPassed = Math.floor(minutesPassed / 60)
	const minutesPassedWoHours = minutesPassed - hoursPassed * 60
	const newMinutes =
		minutes + minutesPassedWoHours >= 60 ? minutes + minutesPassedWoHours - 60 : minutes + minutesPassedWoHours
	const newHours = hours + hoursPassed + (minutes + minutesPassedWoHours >= 60 ? 1 : 0)

	return [String(newHours), String(newMinutes).length === 1 ? `0${newMinutes}` : String(newMinutes)]
}

export type PairType = {
	blackParticipantData?: UserSchema
	whiteParticipantData?: UserSchema
	judgeData?: UserSchema
} & PairSchema

export const tableSchemaPairs = ({
	tableData,
	participants,
	judges,
	startTimeTuple,
	currentUser,
	breakTime
}: {
	tableData: PairSchema[]
	participants: UserSchema[]
	judges: UserSchema[]
	startTimeTuple: string[]
	currentUser: {
		currentUserPairRef: MutableRefObject<undefined | { pair?: PairType; startTime: string }>
		authorizedUserId?: string
	}
	breakTime?: CompetitionSchema['breakTime']
}) => {
	const participantsData = tableData.reduce((acc, pair) => {
		const blackParticipantData = participants.find(({ _id }) => pair.blackParticipant === _id)
		const whiteParticipantData = participants.find(({ _id }) => pair.whiteParticipant === _id)
		const judgeData = judges.find(({ _id }) => pair.judge === _id)

		return [
			...acc,
			{
				...pair,
				blackParticipantData,
				whiteParticipantData,
				judgeData
			}
		]
	}, [] as PairType[])

	const statusStyle =
		'uppercase text-sm md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 xl:row-auto xl:col-start-3 xl:col-end-4 xl:text-base xl:font-bold text-right md:pr-6'

	return participantsData.map((pair, i) => {
		const currentPairTime = getTimeTuplePlusMinutes(
			startTimeTuple,
			(i % judges.length === 0 ? (i * 10) / judges.length : ((i - (i % judges.length)) * 10) / judges.length) +
				(breakTime?.minutes ?? 0)
		).join(':')

		if (
			pair.blackParticipant === currentUser.authorizedUserId ||
			pair.whiteParticipant === currentUser.authorizedUserId
		)
			currentUser.currentUserPairRef.current = {
				pair,
				startTime: currentPairTime
			}

		return {
			cells: [
				{
					node: <span>{i + 1}</span>,
					classes: 'max-w-[20px] text-base xl:font-bold xl:max-w-[50px]'
				},
				{
					node: (
						<div className='grid w-full grid-cols-[1fr_80px] gap-[14px] lg:grid-cols-[1fr_110px] lg:gap-[28px] xl:grid-cols-[25%_50%_15%] xl:gap-[5%]'>
							<div className='md:col-start-1 md:col-end-3 xl:col-auto'>
								<p className='gri mb-[6px] text-base text-black xl:font-bold'>
									{currentPairTime} ({localTZName})
								</p>
								<a
									href={`https://wa.me/${pair.judgeData?.socialNetworks?.whatsup}`}
									target='_blank'
									rel='noreferrer'
									className='inline-flex gap-[8px] text-xs transition hover:opacity-70 xl:text-base'
								>
									<WhatsappIcon className='xl:h-[24px] xl:min-w-[24px]' />
									Judge: {pair.judgeData?.fullName}
								</a>
							</div>
							{pair.acceptedForFight?.blackParticipant && pair.acceptedForFight?.whiteParticipant && (
								<div className={`text-[#FB9F16] ${statusStyle}`}>IN PROGRESS</div>
							)}
							{pair.winner && <div className={`text-[#6DDA64] ${statusStyle}`}>FINISHED</div>}
							{!pair.winner && !pair.acceptedForFight && pair.calledForPreparation && (
								<div className={`text-[#4565D9] ${statusStyle}`}>WAITING</div>
							)}
							<div className='col-start-1 col-end-3 flex justify-between md:col-end-2 xl:col-start-2 xl:col-end-3 xl:row-start-1 xl:row-end-2'>
								<div className='w-[45%]'>
									<p className='mb-[7px] text-sm text-black xl:text-base'>{pair.blackParticipantData?.fullName}</p>
									<p className='text-xs xl:text-base'>
										{getAge(pair.blackParticipantData?.birthDate as string)} age, {pair.blackParticipantData?.weight} kg
									</p>
								</div>
								<span className='mx-[2%] w-[6%] text-sm text-black xl:text-base'>VS</span>
								<div className='w-[45%]'>
									<div className='ml-auto w-fit'>
										<p className='mb-[7px] text-sm text-black xl:text-base'>{pair.whiteParticipantData?.fullName}</p>
										<p className=' text-xs xl:text-base'>
											{getAge(pair.whiteParticipantData?.birthDate as string)} age, {pair.whiteParticipantData?.weight}{' '}
											kg
										</p>
									</div>
								</div>
							</div>
						</div>
					),
					classes: 'pl-0'
				}
			]
		}
	})
}
