import { FC, ReactNode, Suspense } from 'react'
import { twMerge } from 'tailwind-merge'

export const LineSuspense: FC<{ children: ReactNode; showLoader?: boolean; classes?: string }> = ({
	children,
	showLoader = true,
	classes
}) => (
	<Suspense
		fallback={
			showLoader ? <div className={twMerge('loading-skeleton my-1 h-4 w-[60%] max-w-[30rem]', classes)} /> : null
		}
	>
		{children}
	</Suspense>
)
