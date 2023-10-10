import { UserSchema } from 'src/types'
import { CheckboxAndRadioButton } from 'src/ui'
import { ReactComponent as WhatsappIcon } from 'src/assets/whatsapp.svg'

type TableSchemaJudgesType = {
	judges: UserSchema[]
	onSelect: (value?: boolean | string, name?: string) => void
	selectedJudgesId: string[] | []
	disableCheckboxes?: boolean
}

export const tableSchemaJudges = ({ judges, onSelect, selectedJudgesId, disableCheckboxes }: TableSchemaJudgesType) => {
	return judges.map(judge => {
		const checked = (selectedJudgesId as string[])?.includes(judge._id as string)
		return {
			cells: [
				{
					node: (
						<div>
							<p className='mb-1.5 text-sm font-medium text-black md:text-base xl:text-xl'>{judge.fullName}</p>
							<p className='text-xs text-neutral-500 md:text-sm xl:text-base'>
								{judge.address?.country && `${judge.address?.country},`} {judge.address?.city}
							</p>
						</div>
					),
					classes: ''
				},
				{
					node: (
						<div>
							<a
								className='flex-center gap-4 text-sm font-medium text-black transition hover:opacity-70 md:text-base xl:text-xl'
								href={`https://wa.me/${judge.socialNetworks?.whatsup}`}
								target='_blank'
								rel='noreferrer'
							>
								<WhatsappIcon className='w-4 xl:w-6' />
								{judge.socialNetworks?.whatsup}
							</a>
						</div>
					),
					classes: ''
				},
				{
					node: (
						<CheckboxAndRadioButton
							name={judge._id as string}
							type='checkbox'
							checked={checked}
							onChange={onSelect}
							disabled={disableCheckboxes && !checked}
							classes='xl:scale-125 xl:translate-x-1 xl:translate-y-1'
						/>
					),
					classes: '!grow-0 min-w-[2rem] lg:!grow-[1] xl:!grow-[2] '
				}
			]
		}
	})
}
