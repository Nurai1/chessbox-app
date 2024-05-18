import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'

type CompetitionInfoPropsType = {
	title: string | ReactNode
	img: ReactNode
	place?: number
	isCompetitionPage?: boolean
	classes?: string
}

export const CompetitionInfo: FC<CompetitionInfoPropsType> = ({ title, img, place, isCompetitionPage, classes }) => {
	const { t } = useOptionalTranslation()
	return (
		<div
			className={twMerge(
				`${
					isCompetitionPage
						? 'lg:h-fit lg:min-h-[9rem] lg:items-baseline lg:p-4 xl:min-h-[14rem] xl:items-baseline xl:justify-start xl:p-9'
						: 'lg:min-h-[9.375rem] lg:p-6 xl:h-fit'
				} flex items-center justify-center gap-3 p-3 lg:relative lg:items-baseline lg:justify-start lg:rounded-3xl lg:border`,
				classes
			)}
		>
			<div>
				<h3 className={`${isCompetitionPage ? 'xl:text-heading-3' : 'lg:text-heading-4'} font-bold`}>{title}</h3>
				{place && (
					<div className={`${isCompetitionPage ? 'lg:flex-col-reverse xl:mt-3' : ''} mt-2 flex text-heading-4`}>
						<p className={`${isCompetitionPage ? 'xl:-mt-2.5' : ''} text-sm text-grey`}>{t('yourPlace')}&nbsp;</p>
						<p
							className={`${
								isCompetitionPage ? 'lg:text-2xl lg:font-bold lg:text-black xl:text-heading-1' : ''
							} text-sm text-grey `}
						>
							{place}
						</p>
					</div>
				)}
			</div>
			{img}
		</div>
	)
}
