import { ReactComponent as MedalGold } from 'src/assets/medal-gold.svg'
import { ReactComponent as MedalSilver } from 'src/assets/medal-silver.svg'
import { ReactComponent as MedalBronze } from 'src/assets/medal-bronze.svg'
import { UserSchema } from 'src/types'
import { TFunction } from 'src/hooks/useOptionalTranslation'
import { getAge } from '../datetime'

export const tableSchemaRating = (tableData: UserSchema[], t: TFunction) => {
	const renderMedal = (index: number) => {
		if (index === 1) {
			return (
				<>
					<MedalGold className='absolute top-5 left-[0.55rem] -z-10 h-auto w-7 md:top-5 lg:top-2.5 xl:left-[1.3rem]' />
					<span className='hidden text-sm md:inline xl:text-base'>{index}</span>
				</>
			)
		}

		if (index === 2) {
			return (
				<>
					<MedalSilver className='absolute top-5 left-[0.55rem] -z-10 h-auto w-7 md:top-5 lg:top-2.5 xl:left-[1.3rem]' />
					<span className='hidden text-sm md:inline xl:text-base'>{index}</span>
				</>
			)
		}

		if (index === 3) {
			return (
				<>
					<MedalBronze className='absolute top-5 left-[0.55rem] -z-10 h-auto w-7 md:top-5 lg:top-2.5 xl:left-[1.3rem]' />
					<span className='hidden text-sm md:inline xl:text-base'>{index}</span>
				</>
			)
		}

		return <span>{index}</span>
	}

	return tableData.map((user, i) => {
		return {
			cells: [
				{
					node: <div>{renderMedal(i + 1)}</div>,
					classes:
						'items-center text-black w-full !py-2 first:pl-4 max-w-[3rem] lg:max-w-[5rem] xl:max-w-[6.875rem] xl:first:pl-7 2xl:p-2'
				},
				{
					node: (
						<div className='flex flex-col justify-center sm:overflow-hidden'>
							<p className='flex items-center overflow-hidden truncate text-ellipsis text-sm xl:text-base'>
								{user.fullName}
							</p>
							<p className='flex items-center truncate text-sm xl:hidden'>
								{getAge(user.birthDate)} {t('years')}, {user.weight} {t('kg')}
							</p>
							<p className='whitespace-nowrap text-sm lg:hidden'>
								{user?.address?.country}, {user?.address?.city}
							</p>
						</div>
					),
					classes: '!p-2 text-black lg:max-w-none xl:max-w-[15rem]'
				},
				{
					node: (
						<p className='flex items-center truncate text-ellipsis text-sm  xl:text-base'>
							{getAge(user.birthDate)} {t('years')}, {user.weight} {t('kg')}
						</p>
					),
					classes: 'items-center max-w-[11.5rem] !p-2 text-black hidden xl:flex'
				},
				{
					node: (
						<p className='hidden items-center truncate text-ellipsis text-sm lg:flex xl:text-base'>
							{user?.address?.country}, {user?.address?.city}
						</p>
					),
					classes: '!p-2 text-black hidden lg:flex'
				},
				{
					node: (
						<p className='flex items-center truncate text-ellipsis text-sm xl:text-base'>
							{user?.ratingNumber} {t('points')}
						</p>
					),
					classes: 'flex !p-2 text-black !grow-0 min-w-[6rem]  lg:min-w-[9rem] '
				}
			]
		}
	})
}
