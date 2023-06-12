import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

export type HorizontalTabsPropsType = {
	tabs: { isActive: boolean; title: string; onClick: () => void }[]
}

export const HorizontalTabs: FC<HorizontalTabsPropsType> = ({ tabs }) => {
	return (
		<div className='relative'>
			<div className='flex h-[46px] gap-x-6'>
				{tabs.map((tab, idx) => (
					<button
						// eslint-disable-next-line react/no-array-index-key
						key={idx}
						onClick={tab.onClick}
						type='button'
						className={twMerge(
							`h-full truncate text-sm font-medium text-gray-800 max-xl:max-w-[140px]`,
							tab.isActive && 'relative z-10 box-border border-b-2 border-blue-500 text-blue-500'
						)}
					>
						{tab.title}
					</button>
				))}
			</div>
			<div className='absolute bottom-0 left-0 z-0 h-[2px] w-full bg-gray-200' />
		</div>
	)
}
