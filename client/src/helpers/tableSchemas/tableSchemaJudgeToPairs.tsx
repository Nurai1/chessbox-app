import { getAge } from 'src/helpers/datetime'
import { SelectedJudge } from 'src/routes/JudgeAssignPage'
import { PairSchema, UserSchema } from 'src/types'
import { Select } from 'src/ui'

type TableSchemaJudgeToPairsType = {
	tableData: PairSchema[]
	participants: UserSchema[]
	judges: UserSchema[]
	groupId?: string
	selectedJudges?: SelectedJudge
	onSelect: (selectedJudgeData: SelectedJudge) => void
}

export type PairType = {
	blackParticipantData?: UserSchema
	whiteParticipantData?: UserSchema
	judgeData?: UserSchema
	groupId?: string
} & PairSchema

export const tableSchemaJudgeToPairs = ({
	tableData,
	participants,
	judges,
	groupId,
	selectedJudges,
	onSelect
}: TableSchemaJudgeToPairsType) => {
	const participantsData = tableData.reduce((acc, pair) => {
		const blackParticipantData = participants.find(({ _id }) => pair.blackParticipant === _id)
		const whiteParticipantData = participants.find(({ _id }) => pair.whiteParticipant === _id)

		return [
			...acc,
			{
				...pair,
				blackParticipantData,
				whiteParticipantData
			}
		]
	}, [] as PairType[])

	return participantsData.map((pair, i) => {
		const handleSelectJudge = (judgeId: string, pairData: PairType) => {
			const index = selectedJudges?.pairs.findIndex(({ id: pairId }) => pairId === pairData._id)

			if (index === -1) return

			if (selectedJudges && selectedJudges?.pairs[index as number].judgeId !== judgeId) {
				const updatedJudgeData = [
					...selectedJudges.pairs.slice(0, index),
					{
						...selectedJudges?.pairs[index as number],
						judgeId
					},
					...selectedJudges.pairs.slice((index as number) + 1)
				]

				onSelect({
					id: groupId as string,
					pairs: updatedJudgeData
				})
			}
		}

		return {
			cells: [
				{
					node: <span>{i + 1}</span>,
					classes: 'max-w-[20px] text-base xl:font-bold xl:max-w-[50px]'
				},
				{
					node: (
						<div className='grid w-full gap-[0.925rem] lg:grid-cols-[2fr_1fr] xl:lg:grid-cols-[55%_35%] xl:gap-[10%]'>
							<div className='flex justify-between'>
								<div className='w-[45%]'>
									<p className='mb-[7px] text-sm text-black xl:text-base'>{pair.whiteParticipantData?.fullName}</p>
									<p className=' text-xs xl:text-base'>
										{getAge(pair.whiteParticipantData?.birthDate as string)} age, {pair.whiteParticipantData?.weight} kg
									</p>
									<p className='text-xs xl:text-base'>
										{pair.whiteParticipantData?.address?.city}, {pair.whiteParticipantData?.address?.country}
									</p>
								</div>
								<span className='mx-[2%] w-[6%] text-sm text-black xl:text-base'>VS</span>
								<div className='w-[45%]'>
									<div className='ml-auto w-fit lg:ml-[32%]'>
										<p className='mb-[7px] text-sm text-black xl:text-base'>{pair.blackParticipantData?.fullName}</p>
										<p className='text-xs xl:text-base'>
											{getAge(pair.blackParticipantData?.birthDate as string)} age, {pair.blackParticipantData?.weight}{' '}
											kg
										</p>
										<p className='text-xs xl:text-base'>
											{pair.blackParticipantData?.address?.city}, {pair.blackParticipantData?.address?.country}
										</p>
									</div>
								</div>
							</div>
							<div>
								<div className='flex items-center gap-[0.625rem] text-sm text-black xl:text-base'>
									Judge:
									<Select
										onChange={value => handleSelectJudge(value, pair)}
										menuOptions={judges.map(({ fullName, _id }) => ({ value: fullName, id: _id as string }))}
										dropdownPlaceholder='Select judge'
										placeholder='Select judge'
										chosenId={selectedJudges?.pairs[i]?.judgeId}
										selectClasses='text-sm xl:text-base'
									/>
								</div>
							</div>
						</div>
					)
				}
			]
		}
	})
}
