import { ReactComponent as MedalGold } from 'src/assets/medal-gold.svg'
import { ReactComponent as MedalSilver } from 'src/assets/medal-silver.svg'
import { ReactComponent as MedalBronze } from 'src/assets/medal-bronze.svg'
import { UserSchema } from 'src/types'

export const ratingTableSchema = (tableData: UserSchema[]) => {
	const renderMedal = (index: number) => {
		if (index === 1) {
			return (
				<>
					<MedalGold
						className='absolute top-[-5px] left-[-7px] -z-10 h-[28px] w-[21px]
										md:top-[-15px] md:left-[-12px] md:h-[44px] md:w-[36px]
										xl:top-[-23px] xl:left-[-14px] xl:h-[64px] xl:w-[50px]'
					/>
					<span className='hidden md:inline'>{index}</span>
				</>
			)
		}

		if (index === 2) {
			return (
				<>
					<MedalSilver
						className='absolute top-[-5px] left-[-7px] -z-10 h-[28px] w-[21px]
											md:top-[-15px] md:left-[-12px] md:h-[44px] md:w-[36px]
											xl:top-[-23px] xl:left-[-14px] xl:h-[64px] xl:w-[50px]'
					/>
					<span className='hidden md:inline'>{index}</span>
				</>
			)
		}

		if (index === 3) {
			return (
				<>
					<MedalBronze
						className='absolute top-[-5px] left-[-7px] -z-10 h-[28px] w-[21px]
											md:top-[-15px] md:left-[-12px] md:h-[44px] md:w-[36px]
											xl:top-[-23px] xl:left-[-14px] xl:h-[64px] xl:w-[50px]'
					/>
					<span className='hidden md:inline'>{index}</span>
				</>
			)
		}

		return <span>{index}</span>
	}

	return tableData.map((user, i) => {
		return {
			cells: [
				{
					node: <div className='relative text-sm font-normal xl:text-2xl xl:font-semibold'>{renderMedal(i + 1)}</div>,
					classes:
						'flex items-center justify-center w-full text-base text-black max-w-[50px] md:font-bold md:max-w-[70px] lg:font-semibold lg:text-2xl lg:max-w-[100px] xl:font-medium lg:text-xl 2xl:text-2xl 2xl:font-semibold'
				},
				{
					node: (
						<div>
							<p
								className='text-sm font-normal text-black transition hover:opacity-70
                            xl:text-2xl xl:font-semibold'
							>
								{user.fullName}
							</p>
							<p className='xl:hidden'>{user.gender}</p>
							<p
								className='text-[#6C6A6C]
                            md:text-base'
							>
								{user.age ? `age ${user.age}` : ''}
								{user.weight ? `, ${user.weight} kg` : ''}
							</p>
						</div>
					),
					classes: 'min-h-[90px] items-center !grow-[2] md:!py-[10px] xl:!grow-[1]'
				},
				{
					node: (
						<p className='text-xl font-medium text-black'>
							{user.address?.country}
							{user.address?.country ? ',' : ''} {user.address?.city}
						</p>
					),
					classes: 'hidden xl:flex'
				},
				{
					node: (
						<p
							className='text-sm font-normal text-black
                    xl:text-xl xl:font-medium'
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
