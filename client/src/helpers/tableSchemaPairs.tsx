import { PairSchema, UserSchema } from 'src/types'

export const tableSchemaPairs = (tableData: PairSchema[], participants: UserSchema[]) => {
    console.log({ tableData })
    console.log({ participants })


    const participantsData = tableData.reduce((acc, pair) => {
        const blackParticipantData = participants.find(({_id}) => pair.blackParticipant === _id)
        const whiteParticipantData = participants.find(({_id}) => pair.whiteParticipant === _id)
        // console.log({ blackParticipantData }, { whiteParticipantData })
    })


    return tableData.map((pair, i) => {
        return {
            cells: [
                {
                    node: (
                        <span>{i + 1}</span>
                    ),
                    classes: '!grow-[2] md:!grow !py-[13px]'
                },
                {
                    node: (
                        <div>
                            <p>19:00 (East Europe - Moscow)</p>
                        </div>
                    ),
                    classes: 'hidden !py-[13px] md:block'
                }
            ]
        }
    })
}
