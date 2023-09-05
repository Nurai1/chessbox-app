import { UserSchema } from 'src/types'

export const tableSchemaGroupCreateParticipants = (tableData: UserSchema[]) => {
	return tableData.map((user, i) => {
		return {
			cells: [
				{
					node: (
						i + 1
					),
					classes: 'max-w-[3rem] pr-2 py-2 min-h-[5.25rem] text-black'
				},
				{
					node: (
						user.fullName
					),
					classes: 'max-w-[12.5rem] px-2 py-2 min-h-[5.25rem] text-black'
				},
				{
					node: (
						user.gender
					),
					classes: 'max-w-[6.5rem] px-2 py-2 min-h-[5.25rem] text-black'
				},
				{
					node: (
						<span>{user.age} age</span>
					),
					classes: 'max-w-[6.5rem] px-2 py-2 min-h-[5.25rem] text-black'
				},
				{
					node: (
						<span>{user.weight} kg</span>
					),
					classes: 'max-w-[6.5rem] px-2 py-2 min-h-[5.25rem] text-black'
				},
				{
					node: (
						'Group'
					),
					classes: 'w-full pl-2 py-2 min-h-[5.25rem] text-black'
				}
			]
		}
	})
}
