import { FC, ReactNode, Suspense } from 'react'
import { twMerge } from 'tailwind-merge'

export const SpinnerLoader: FC<{ classes?: string }> = ({ classes }) => (
	<div className={twMerge('flex-center h-full w-full', classes)}>
		<div className='box-border h-12 w-12 animate-spin rounded-full border-[5px] border-blue-500 border-t-gray-300' />
	</div>
)

export const SpinnerSuspense: FC<{ children: ReactNode; showLoader?: boolean; classes?: string }> = ({
	children,
	showLoader = true,
	classes
}) => <Suspense fallback={showLoader ? <SpinnerLoader classes={classes} /> : null}>{children}</Suspense>
