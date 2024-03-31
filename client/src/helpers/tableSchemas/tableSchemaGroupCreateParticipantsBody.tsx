import { ParticipantSchema } from 'src/types'
import { getAge } from 'src/helpers/datetime'

export const tableSchemaGroupCreateParticipantsBody = (tableData: ParticipantSchema[]) => {
	return tableData.map((user, i) => {
		return {
			cells: [
				{
					node: i + 1,
					classes: `max-w-[3rem] pr-2 py-2 min-h-[5.25rem] ${user.groupOverlap ? 'text-error-red' : 'text-black'}`
				},
				{
					node: (
						<div>
							<div>{user.fullName}</div>
							<div className='text-grey'>
								{user.address?.city}, {user.address?.country}
							</div>
						</div>
					),
					classes: `max-w-[12.5rem] px-2 py-2 min-h-[5.25rem] ${user.groupOverlap ? 'text-error-red' : 'text-black'}`
				},
				{
					node: user.gender,
					classes: `max-w-[6.5rem] px-2 py-2 min-h-[5.25rem] capitalize ${
						user.groupOverlap ? 'text-error-red' : 'text-black'
					}`
				},
				{
					node: <span>{getAge(user.birthDate)} age</span>,
					classes: `max-w-[6.5rem] px-2 py-2 min-h-[5.25rem] ${user.groupOverlap ? 'text-error-red' : 'text-black'}`
				},
				{
					node: <span>{user.weight} kg</span>,
					classes: `max-w-[6.5rem] px-2 py-2 min-h-[5.25rem] ${user.groupOverlap ? 'text-error-red' : 'text-black'}`
				},
				{
					node: user.group,
					classes: `w-full pl-2 py-2 min-h-[5.25rem] capitalize ${user.groupOverlap ? 'text-error-red' : 'text-black'}`
				}
			]
		}
	})
}
