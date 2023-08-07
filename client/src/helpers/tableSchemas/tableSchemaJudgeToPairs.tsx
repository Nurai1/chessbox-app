import { PairSchema, UserSchema } from 'src/types'
import { getAge } from 'src/helpers/datetime'

export type PairType = {
    blackParticipantData?: UserSchema
    whiteParticipantData?: UserSchema
    judgeData?: UserSchema
} & PairSchema

export const tableSchemaJudgeToPairs = (tableData: PairSchema[], participants: UserSchema[]) => {
    const participantsData = tableData.reduce((acc, pair) => {
        const blackParticipantData = participants.find(({ _id }) => pair.blackParticipant === _id)
        const whiteParticipantData = participants.find(({ _id }) => pair.whiteParticipant === _id)
        // const judgeData = judges.find(({ _id }) => pair.judge === _id)

        return [
            ...acc,
            {
                ...pair,
                blackParticipantData,
                whiteParticipantData,
                // judgeData
            }
        ]
    }, [] as PairType[])

    return participantsData.map((pair, i) => {
        return {
            cells: [
                {
                    node: <span>{i + 1}</span>,
                    classes: 'max-w-[20px] text-base xl:font-bold xl:max-w-[50px]'
                },
                {
                    node: (
                        <div className='grid gap-[0.925rem] w-full lg:grid-cols-[2fr_1fr]'>
                            <div className='flex justify-between'>
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
                                            {getAge(pair.whiteParticipantData?.birthDate as string)} age, {pair.whiteParticipantData?.weight} kg
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>Select Judge</div>
                        </div>
                    ),
                    classes: 'pl-0'
                }
            ]
        }
    })
}
