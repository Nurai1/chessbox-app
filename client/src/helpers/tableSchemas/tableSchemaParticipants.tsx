import { UserSchema } from 'src/types'
import { getAge } from 'src/helpers/datetime'
import { TFunction } from 'src/hooks/useOptionalTranslation'

export const tableSchemaParticipants = (tableData: UserSchema[], t: TFunction) => {
	return tableData.map(user => {
		return {
			cells: [
				{
					node: (
						<div className='text-sm xl:text-base'>
							<p className='mb-[6px] font-bold text-black'>{user.fullName}</p>
							<p className='mb-[4px] text-grey md:hidden'>
								{user.address?.country}
								{user.address?.country ? ',' : ''} {user.address?.city}
							</p>
							<p className='text-grey'>{`${getAge(user.birthDate)} ${t('years')}, ${user.weight} ${t('kg')}`}</p>
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
					node: (
						<p className='ml-auto text-sm font-normal text-black xl:text-base'>
							{user?.ratingNumber} {t('points')}
						</p>
					),
					classes: '!py-[13px]'
				}
			]
		}
	})
}

export const tableSchemaResults = (tableData: UserSchema[], t: TFunction) => {
	return tableData.map((user, index) => {
		return {
			cells: [
				{
					node: <p className='max-w-[40px] text-sm font-medium text-black xl:text-base'>{index + 1}</p>,
					classes: '!py-[13px] !grow-0'
				},
				{
					node: (
						<div className='text-sm xl:text-base'>
							<p className='mb-[6px] font-bold text-black'>{user.fullName}</p>
							<p className='mb-[4px] text-grey md:hidden'>
								{user.address?.country}
								{user.address?.country ? ',' : ''} {user.address?.city}
							</p>
							<p className='text-grey'>{`${getAge(user.birthDate)} ${t('years')}, ${user.weight} ${t('kg')}`}</p>
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
					node: (
						<p className='ml-auto text-sm font-normal text-black xl:text-base'>
							{user?.ratingNumber} {t('points')}
						</p>
					),
					classes: '!py-[13px]'
				}
			]
		}
	})
}
