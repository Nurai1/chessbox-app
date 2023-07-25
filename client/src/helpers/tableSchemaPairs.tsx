import { PairSchema, UserSchema } from 'src/types'
import { ReactComponent as WhatsappIcon } from 'src/assets/whatsapp.svg'

type TablePairType = {
	blackParticipantData?: UserSchema
	whiteParticipantData?: UserSchema
	judgeData?: UserSchema
} & PairSchema

export const tableSchemaPairs = (tableData: PairSchema[], participants: UserSchema[], judges: UserSchema[]) => {
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
	}, [] as TablePairType[])

	const statusStyle =
		'uppercase text-sm md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 xl:row-auto xl:col-start-3 xl:col-end-4 xl:text-base xl:font-bold'

	return participantsData.map((pair, i) => {
		return {
			cells: [
				{
					node: <span>{i + 1}</span>,
					classes: 'max-w-[20px] text-base xl:font-bold xl:max-w-[50px]'
				},
				{
					node: (
						<div className='grid w-full grid-cols-[1fr_80px] gap-[14px] lg:grid-cols-[1fr_110px] lg:gap-[28px] xl:grid-cols-[25%_50%_10%] xl:gap-[5%]'>
							<div className='md:col-start-1 md:col-end-3 xl:col-auto'>
								<p className='gri mb-[6px] text-base text-black xl:font-bold'>Starts time</p>
								<div className='flex gap-[8px]'>
									<WhatsappIcon className='xl:h-[24px] xl:min-w-[24px]' />
									<p className='text-xs xl:text-base'>Judge: {pair.judgeData?.fullName}</p>
								</div>
							</div>
							{pair.calledForFight && <span className={`text-[#FB9F16] ${statusStyle}`}>IN PROGRESS</span>}
							{pair.winner && <span className={`text-[#6DDA64] ${statusStyle}`}>FINISHED</span>}
							{!pair.winner && !pair.calledForFight && <span className={`text-[#4565D9] ${statusStyle}`}>WAITING</span>}
							<div className='col-start-1 col-end-3 flex justify-between md:col-end-2 xl:col-start-2 xl:col-end-3 xl:row-start-1 xl:row-end-2'>
								<div className='w-[45%]'>
									<p className='mb-[7px] text-sm text-black xl:text-base'>{pair.blackParticipantData?.fullName}</p>
									<p className='text-xs xl:text-base'>
										{pair.blackParticipantData?.age} age, {pair.blackParticipantData?.weight} kg
									</p>
								</div>
								<span className='mx-[2%] w-[6%] text-sm text-black xl:text-base'>VS</span>
								<div className='w-[45%]'>
									<div className='ml-auto w-fit'>
										<p className='mb-[7px] text-sm text-black xl:text-base'>{pair.whiteParticipantData?.fullName}</p>
										<p className=' text-xs xl:text-base'>
											{pair.whiteParticipantData?.age} age, {pair.whiteParticipantData?.weight} kg
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
