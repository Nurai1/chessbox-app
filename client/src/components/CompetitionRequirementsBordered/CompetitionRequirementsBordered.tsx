import { FC } from 'react'
import { CompetitionRequirementsSchema } from 'src/types'
import { twMerge } from 'tailwind-merge'
import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'

type CompetitionRequirementsBorderedPropsType = {
	competitionRequirements: CompetitionRequirementsSchema
	classes?: string
}

export const CompetitionRequirementsBordered: FC<CompetitionRequirementsBorderedPropsType> = ({
	competitionRequirements,
	classes
}) => {
	const { t } = useOptionalTranslation()
	return (
		<div className={twMerge('max-w-[16rem] rounded-3xl border border-pale-grey py-5 px-6', classes)}>
			<h3 className='mb-2.5 text-2xl font-semibold'>{t('competitionRequirements')}:</h3>
			<div className='flex justify-between'>
				<div className='grow border-r border-pale-grey pr-4'>
					<p className='text-grey'>{t('age')}</p>
					<p className='font-bold'>
						{competitionRequirements?.ageCategory?.from} -{competitionRequirements?.ageCategory?.to}
					</p>
				</div>
				<div className='grow border-r border-pale-grey pr-4 pl-4'>
					<p className='text-grey'>{t('weight')}</p>
					<p className='font-bold'>
						{competitionRequirements?.weightCategory?.from} -{competitionRequirements?.weightCategory?.to}{' '}
						<span className='text-grey'>{t('kg')}</span>
					</p>
				</div>
				<div className='grow pl-4'>
					<p className='text-grey'>{t('gender')}</p>
					<p className='font-bold'>{competitionRequirements?.gender}</p>
				</div>
			</div>
		</div>
	)
}
