import { getAge } from 'src/helpers/datetime'
import { UserSchema } from 'src/types'
import { Input } from '../../ui'

export const tableSchemaGroupParticipants = (
	tableData: (UserSchema & { userGridPlace?: string | undefined; setUserGridPlace?: (val?: string) => void })[]
) => {
	return tableData.map(({ fullName, birthDate, weight, userGridPlace, setUserGridPlace }, i) => {
		return {
			cells: [
				userGridPlace && setUserGridPlace
					? {
							node: <Input value={userGridPlace} onChange={setUserGridPlace} classes='px-2 h-8 w-12' placeholder='№' />,
							classes: 'flex-center max-w-[8rem] pr-1 text-black'
						}
					: {
							node: i + 1,
							classes: 'flex-center max-w-[3rem] pr-1 text-black'
						},
				{
					node: fullName,
					classes: 'max-w-[16rem] px-1 text-black items-center'
				},
				{
					node: (
						<p>
							{getAge(birthDate)} <span>age</span>
						</p>
					),
					classes: 'max-w-[9rem] px-1 text-black items-center'
				},
				{
					node: (
						<p>
							{weight} <span>kg</span>
						</p>
					),
					classes: 'pl-1 text-black items-center'
				}
			]
		}
	})
}
