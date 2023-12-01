import { FC, ReactNode } from 'react'
// import { ReactComponent as Loader } from 'src/assets/loader.svg'
import { twMerge } from 'tailwind-merge'

type RequestAwaitAcceptionPropsType = {
	children?: ReactNode
	isCompetitionPage?: boolean
}

export const RequestAwaitAcception: FC<RequestAwaitAcceptionPropsType> = ({ children, isCompetitionPage }) => {
	return (
		<div>
			<div
				className={twMerge(
					'md: flex items-center gap-6 rounded-[1.25rem] border py-5 px-4 pl-5 pr-11 sm:pl-11 sm:pr-16 md:py-6 lg:flex-col lg:gap-3 lg:px-4 lg:py-[1.125rem] xl:gap-6 xl:py-[1.875rem] xl:px-5',
					!isCompetitionPage && 'lg:flex-row xl:flex-col xl:gap-0 xl:p-5'
				)}
			>
				<p
					className={twMerge(
						'lg:min text-xs lg:mr-auto lg:w-36 xl:w-48 xl:text-base',
						!isCompetitionPage && 'xl:mr-auto xl:w-44'
					)}
				>
					Your request has been accepted, please await confirmation. <br className='hidden lg:block' /> (about 2 days)
				</p>
				{/* TODO: add loader */}
				{/* <Loader
					className={twMerge(
						'min-h-[3rem] min-w-[3rem] animate-spin lg:ml-auto lg:-mt-12 lg:min-h-[4rem] lg:min-w-[4rem] xl:ml-44 xl:-mt-14 xl:min-h-[6.75rem] xl:min-w-[6.75rem]',
						!isCompetitionPage && 'lg:mt-0 xl:ml-auto xl:-mt-8 xl:mr-2 xl:min-h-[4rem] xl:min-w-[4rem]'
					)}
				/> */}
				{children}
			</div>
		</div>
	)
}
