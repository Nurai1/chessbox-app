import { UserSchema } from 'src/types'

export const tableSchemaParticipants = (tableData: UserSchema[]) => {
	return tableData.map(user => {
		return {
			cells: [
				{
					node: (
						<div className='text-sm xl:text-base'>
							<p className='mb-[6px] text-black'>{user.fullName}</p>
							<p className='mb-[4px] text-[#6C6A6C] md:hidden'>
								{user.address?.country}
								{user.address?.country ? ',' : ''} {user.address?.city}
							</p>
							<p className='text-[#6C6A6C]'>{`${user.age} age, ${user.weight} kg`}</p>
						</div>
					),
					classes: '!grow-[2] md:!grow !py-[13px]'
				},
				{
					node: (
						<p className='text-center text-sm text-black xl:text-base'>
							{user.address?.country}
							{user.address?.country ? ',' : ''} {user.address?.city}
						</p>
					),
					classes: 'hidden !py-[13px] md:block'
				},
				{
					node: <p className='ml-auto text-sm font-normal text-black xl:text-base'>{user?.ratingNumber} Points</p>,
					classes: '!py-[13px]'
				}
			]
		}
	})
}
