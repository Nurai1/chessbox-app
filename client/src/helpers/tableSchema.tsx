import { Link } from 'react-router-dom'
import { ReactComponent as MedalGold } from 'assets/medal-gold.svg'
import { ReactComponent as MedalSilver } from 'assets/medal-silver.svg'
import { ReactComponent as MedalBronze } from 'assets/medal-bronze.svg'
import { User } from '../types'

export const ratingTableSchema = (tableData: User[]) => {
	const renderMedal = (index: number) => {
		if (index === 1) {
			return <MedalGold className='absolute top-[-27px] left-[-14px] -z-10' />
		}

		if (index === 2) {
			return <MedalSilver className='absolute top-[-27px] left-[-14px] -z-10' />
		}

		if (index === 3) {
			return <MedalBronze className='absolute top-[-27px] left-[-14px] -z-10' />
		}

		return null
	}

	return tableData.map((user, i) => {
		return {
			cells: [
				{
					node: (
						<div className='relative'>
							{renderMedal(i + 1)}
							{i + 1}
						</div>
					),
					classes:
						'flex items-center justify-center w-full text-base text-black max-w-[50px] md:font-bold md:max-w-[70px] lg:font-semibold lg:text-2xl lg:max-w-[100px] xl:font-medium lg:text-xl 2xl:text-2xl 2xl:font-semibold'
				},
				{
					node: (
						<div>
							<Link
								to={user._id}
								className='text-base font-normal text-black transition hover:opacity-70
                            md:text-xl md:font-medium
                            lg:text-2xl lg:font-semibold
                            xl:text-xl xl:font-medium
                            2xl:text-2xl 2xl:font-semibold'
							>
								{user?.username}
							</Link>
							<p className='xl:hidden'>{user?.gender}</p>
							<p
								className='text-[#6C6A6C]
                            md:text-base'
							>
								{user?.age ? `age ${user?.age}` : ''}
								{user.weight?.number ? `, ${user.weight?.number} ${user.weight?.measureUnit}` : ''}
							</p>
						</div>
					),
					classes: 'min-h-[90px] md:min-h-[134px] lg:min-h-[140px] xl:min-h-[115px] !grow-[2] xl:!grow-[1]'
				},
				{
					node: <p className='text-xl font-medium text-black'>Russia, Ufa</p>,
					classes: 'hidden xl:flex'
				},
				{
					node: (
						<p
							className='text-sm font-normal text-black
                    md:text-base md:font-medium
                    xl:text-xl
                    2xl:text-xl 2xl:font-medium'
						>
							{user?.ratingNumber} Points
						</p>
					),
					classes: '2xl:min-w-[45%] xl:min-w-[40%]'
				}
			]
		}
	})
}
