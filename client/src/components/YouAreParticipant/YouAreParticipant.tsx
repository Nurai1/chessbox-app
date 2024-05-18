import { FC } from 'react'
import { ReactComponent as ThreeStarsIcon } from 'src/assets/three-stars.svg'
import { ReactComponent as TwoStarsIcon } from 'src/assets/two-stars.svg'
import { Button } from 'src/ui'

import { twMerge } from 'tailwind-merge'
import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'

type YouAreParticipantPropsType =
	| {
			isCompetitionPage: true
			onSideMenuOpen: () => void
			classes?: string
	  }
	| {
			isCompetitionPage?: false
			onSideMenuOpen?: never
			classes?: string
	  }

export const YouAreParticipant: FC<YouAreParticipantPropsType> = ({ onSideMenuOpen, isCompetitionPage, classes }) => {
	const { t } = useOptionalTranslation()
	return (
		<div
			className={twMerge(
				`${
					isCompetitionPage
						? 'lg:h-fit lg:rounded-[1.25rem] lg:p-4 xl:max-w-[21.6rem] xl:p-[1.75rem]'
						: 'lg:rounded-3xl lg:p-6'
				} lg:border`,
				classes
			)}
		>
			<div
				className={`${
					isCompetitionPage ? 'lg:mb-3 lg:p-2.5 xl:mb-[2.5rem] xl:p-0' : 'lg:h-full'
				} relative m-auto w-[16.25rem] lg:flex lg:w-full lg:flex-col`}
			>
				<h3
					className={`${
						isCompetitionPage ? 'mb-4 xl:text-heading-3' : 'lg:mb-3 lg:text-2xl lg:font-semibold'
					} py-5 text-center font-bold lg:p-0 lg:text-left`}
				>
					{t('youAre')} <br className='hidden lg:inline' /> {t('participant')}!
				</h3>
				{isCompetitionPage && (
					<p className='text-center text-xs lg:text-left xl:text-base'>{t('informationWillPublished')}</p>
				)}
				<ThreeStarsIcon
					className={`${
						isCompetitionPage
							? 'xl:-top-3 xl:right-[6.5rem] xl:block xl:w-[2.75rem]'
							: 'lg:right-16 lg:block lg:w-[2.125rem] xl:-top-0.5'
					} absolute hidden`}
				/>
				<ThreeStarsIcon
					className={`${
						isCompetitionPage ? 'lg:right-12 xl:right-2 xl:top-2 xl:w-[2.75rem]' : 'lg:top-4 lg:w-[2.125rem] xl:right-1'
					} absolute right-0 -top-1 w-[1.875rem]`}
				/>
				<TwoStarsIcon
					className={`${
						isCompetitionPage
							? 'top-8 lg:left-auto lg:right-2 lg:w-[1.75rem] xl:top-[4.5rem] xl:right-[2.5rem] xl:w-[2.5rem]'
							: 'lg:top-auto lg:bottom-2 lg:right-10 lg:left-auto xl:-bottom-1 xl:right-4'
					} absolute left-0 top-4`}
				/>
				{!isCompetitionPage && (
					<p className='text-center text-sm text-grey lg:max-w-[11rem] lg:text-left'>{t('goToPage')}</p>
				)}
			</div>

			{isCompetitionPage && (
				<div className='fixed inset-x-0 bottom-0 bg-white p-6 shadow-[0px_1px_18px_5px_rgba(34,60,80,0.2)] lg:static lg:p-0 lg:shadow-none'>
					<Button
						onClick={onSideMenuOpen}
						type='outlined'
						classes='w-full lg:font-normal lg:text-sm lg:px-0 xl:text-base xl:font-bold'
					>
						{t('checkParticipants')}
					</Button>
				</div>
			)}
		</div>
	)
}
