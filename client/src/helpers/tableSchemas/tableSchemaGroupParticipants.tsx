import { getAge } from 'src/helpers/datetime'
import { UserSchema } from 'src/types'
import { TFunction } from 'src/hooks/useOptionalTranslation'
import { Input } from '../../ui'

export const tableSchemaGroupParticipants = (
	tableData: (UserSchema & { userGridPlace?: string | undefined; setUserGridPlace?: (val?: string) => void })[],
	t: TFunction
) => {
	return tableData.map(({ fullName, birthDate, weight, userGridPlace, setUserGridPlace, address }, i) => {
		return {
			cells: [
				setUserGridPlace
					? {
							node: <Input value={userGridPlace} onChange={setUserGridPlace} classes='px-2 h-8 w-12' placeholder='№' />,
							classes: 'flex-center max-w-[8rem] pr-1 text-black'
						}
					: {
							node: i + 1,
							classes: 'flex-center max-w-[3rem] pr-1 text-black'
						},
				{
					node: (
						<div>
							<div>{fullName}</div>
							<div className='text-grey'>
								{address?.city}, {address?.country}
							</div>
						</div>
					),
					classes: 'max-w-[16rem] px-1 text-black items-center'
				},
				{
					node: (
						<p>
							{getAge(birthDate)} <span>{t('years')}</span>
						</p>
					),
					classes: 'max-w-[9rem] px-1 text-black items-center'
				},
				{
					node: (
						<p>
							{weight} <span>{t('kg')}</span>
						</p>
					),
					classes: 'pl-1 text-black items-center'
				}
			]
		}
	})
}
