import { getAge } from 'src/helpers/datetime'
import { TFunction } from 'src/hooks/useOptionalTranslation'
import { UserSchema } from 'src/types'

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

const getPlaceForTableSchemaResults = (index: number) => {
	const place = index + 1
	if (place === 1 || place === 2 || place === 3) {
		return place
	}
	if (place === 4) {
		return place - 1
	}

	const log2OfPlace = Math.log2(place)
	const bottomPlace = Math.floor(log2OfPlace)
	const topPlace = Math.ceil(log2OfPlace)

	if (bottomPlace !== topPlace) {
		return `${2 ** bottomPlace + 1} - ${2 ** topPlace}`
	}

	return `${2 ** (bottomPlace - 1) + 1} - ${2 ** topPlace}`
}
export const tableSchemaResults = (tableData: UserSchema[], t: TFunction) => {
	return tableData.map((user, index) => {
		return {
			cells: [
				{
					node: (
						<p className='whitespace-nowrap text-sm font-medium text-black xl:text-base'>
							{getPlaceForTableSchemaResults(index)}
						</p>
					),
					classes: '!py-[13px] !grow-0 min-w-[40px] flex justify-center'
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
