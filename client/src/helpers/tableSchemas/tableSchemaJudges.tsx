import { UserSchema } from 'src/types'
import { Checkbox } from 'src/ui'
import { ReactComponent as WhatsappIcon } from 'src/assets/whatsapp.svg'

type TableSchemaJudgesType = {
    judges: UserSchema[]
    onSelect: (value?: boolean, name?: string) => void
    selectedJudges: string[] | []
    disableCheckboxes?: boolean
}

export const tableSchemaJudges = ({ judges, onSelect, selectedJudges, disableCheckboxes }: TableSchemaJudgesType) => {
    return judges.map(judge => {
        const checked = (selectedJudges as string[])?.includes(judge._id as string)
        return {
            cells: [
                {
                    node: (
                        <div>
                            <p className="mb-1.5 text-sm text-black font-medium md:text-base xl:text-xl">{judge.fullName}</p>
                            <p className="text-xs text-neutral-500 md:text-sm xl:text-base">
                                {judge.address?.country && `${judge.address?.country},`} {judge.address?.city}
                            </p>
                        </div>
                    ),
                    classes: ''
                },
                {
                    node: (
                        <div>
                            <a className="flex-center gap-4 font-medium text-black text-sm hover:opacity-70 transition md:text-base xl:text-xl"
                               href={`https://wa.me/${judge.socialNetworks?.whatsup}`}>
                                <WhatsappIcon className="w-4 xl:w-6"/>
                                {judge.socialNetworks?.whatsup}
                            </a>
                        </div>
                    ),
                    classes: ''
                },
                {
                    node: <Checkbox name={judge._id as string} checked={checked} onChange={onSelect}
                                    disabled={disableCheckboxes && !checked}
                                    classes="xl:scale-125 xl:translate-x-1 xl:translate-y-1"/>,
                    classes: '!grow-0 min-w-[2rem] lg:!grow-[1] xl:!grow-[2] '
                }
            ]
        }
    })
}
