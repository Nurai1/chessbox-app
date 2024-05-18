import { FC } from 'react'
import { CompetitionRequirementsSchema } from 'src/types'
import { twMerge } from 'tailwind-merge'
import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'

type CompetitionRequirementsPropsType = {
	competitionRequirements: CompetitionRequirementsSchema
	classes?: string
}

export const CompetitionRequirements: FC<CompetitionRequirementsPropsType> = ({ competitionRequirements, classes }) => {
	const { t } = useOptionalTranslation()
	return (
		<div className={twMerge('flex items-center', classes)}>
			<p className='max-w-[9.375rem] pr-2 text-grey md:pr-4 xl:font-bold'>{t('competitionRequirements')}:</p>
			<div className='min-w-[6.25rem] border-x px-2 md:px-4'>
				<p className='mb-2 text-sm xl:text-base'>{t('age')}:</p>
				<p className='whitespace-nowrap font-bold'>
					{competitionRequirements?.ageCategory?.from} - {competitionRequirements?.ageCategory?.to}{' '}
				</p>
			</div>
			<div className='min-w-[6.25rem] border-r px-2 md:px-4'>
				<p className='mb-2 text-sm xl:text-base'>{t('weight')}:</p>
				<p className='whitespace-nowrap font-bold'>
					{competitionRequirements?.weightCategory?.from} - {competitionRequirements?.weightCategory?.to}
					<span className='text-grey'> {t('kg')}</span>
				</p>
			</div>
			<div className='min-w-[6.25rem] pl-2 md:pl-4'>
				<p className='mb-2 text-sm xl:text-base'>{t('gender')}:</p>
				<p className='whitespace-nowrap font-bold'>{competitionRequirements?.gender}</p>
			</div>
		</div>
	)
}
