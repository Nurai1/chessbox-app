import { UserSchema } from 'src/types'
import { getAge } from 'src/helpers/datetime'

export const tableSchemaGroupParticipants = (tableData: UserSchema[]) => {
	return tableData.map(({fullName, birthDate, weight}, i) => {
		return {
			cells: [
				{
					node: i + 1,
					classes: 'max-w-[3rem] pr-1'
				},
				{
					node: fullName,
					classes: 'max-w-[14rem] px-1'
				},
				{
					node: <p>{getAge(birthDate)} <span>age</span></p> ,
					classes: 'max-w-[9rem] px-1'
				},
				{
					node: <p>{weight} <span>kg</span></p> ,
					classes: 'pl-1'
				}
			]
		}
	})
}
