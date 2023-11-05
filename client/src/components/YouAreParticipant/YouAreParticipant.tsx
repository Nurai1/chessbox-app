import { FC } from 'react'
import { ReactComponent as ThreeStarsIcon } from 'src/assets/three-stars.svg'
import { ReactComponent as TwoStarsIcon } from 'src/assets/two-stars.svg'
import { Button } from 'src/ui'

import { twMerge } from 'tailwind-merge'

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
	return (
		<div className={twMerge(`${isCompetitionPage ? 'lg:rounded-[1.25rem] lg:p-4 lg:h-fit xl:max-w-[21.6rem] xl:p-[1.75rem]' : 'lg:rounded-3xl lg:p-6'} lg:border`, classes)}>
			<div className={`${isCompetitionPage ? 'lg:p-2.5 lg:mb-3 xl:p-0 xl:mb-[2.5rem]' : 'lg:h-full'} relative m-auto w-[16.25rem] lg:w-full lg:flex lg:flex-col`}>
				<h3 className={`${isCompetitionPage ? 'mb-4 xl:text-heading-3' : 'lg:mb-3 lg:text-2xl lg:font-semibold'} py-5 text-center font-bold lg:text-left lg:p-0`}>
					You are <br className='hidden lg:inline' /> participant!
				</h3>
				{isCompetitionPage && <p className='text-center text-xs lg:text-left xl:text-base'>Additional information will be published later</p>}
				<ThreeStarsIcon className={`${isCompetitionPage ? 'xl:w-[2.75rem] xl:block xl:-top-3 xl:right-[6.5rem]' : 'lg:block lg:w-[2.125rem] lg:right-16 xl:-top-0.5'} absolute hidden`} />
				<ThreeStarsIcon className={`${isCompetitionPage ? 'lg:right-12 xl:w-[2.75rem] xl:right-2 xl:top-2' : 'lg:w-[2.125rem] lg:top-4 xl:right-1'} absolute right-0 -top-1 w-[1.875rem]`} />
				<TwoStarsIcon className={`${isCompetitionPage ? 'lg:left-auto lg:right-2 top-8 lg:w-[1.75rem] xl:w-[2.5rem] xl:top-[4.5rem] xl:right-[2.5rem]' : 'lg:top-auto lg:bottom-2 lg:right-10 lg:left-auto xl:-bottom-1 xl:right-4'} absolute left-0 top-4`} />
				{!isCompetitionPage && <p className='text-sm text-grey text-center lg:max-w-[11rem] lg:text-left'>Go to the competition page for details</p>}
			</div>

			
			{isCompetitionPage && (
				<div className='fixed inset-x-0 bottom-0 bg-white p-6 shadow-[0px_1px_18px_5px_rgba(34,60,80,0.2)] lg:static lg:p-0 lg:shadow-none'>
					<Button
						onClick={onSideMenuOpen}
						type='outlined'
						classes='w-full lg:font-normal lg:text-sm lg:px-0 xl:text-base xl:font-bold'
					>
						Check out <span className='md:hidden xl:inline'>other</span>
						participants
					</Button>
				</div>
			)}
		</div>
	)
}
