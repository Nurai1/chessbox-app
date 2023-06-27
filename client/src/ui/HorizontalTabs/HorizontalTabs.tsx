import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

export type HorizontalTabsPropsType = {
	tabs: { isActive: boolean; title: string; onClick: () => void }[]
	tabMinWidth?: string
	classes?: string
}

export const HorizontalTabs: FC<HorizontalTabsPropsType> = ({ tabs, tabMinWidth, classes }) => {
	const tabBorder =
		'after:absolute after:w-px after:h-full after:bg-[#DADADA] after:top-0 after:right-[-6px] last:after:content-none'
	return (
		<div>
			<nav className='flex h-[48px] overflow-x-auto rounded-lg border border-[#DADADA] bg-[#F2F2F2] p-[3px] xl:inline-flex'>
				{tabs.map((tab, idx) => (
					<button
						// eslint-disable-next-line react/no-array-index-key
						key={idx}
						onClick={() => tab.onClick()}
						type='button'
						className={twMerge(
							`h-full w-full select-none whitespace-nowrap rounded-lg border border-transparent px-3 py-2 text-base font-semibold text-[#6C6A6C] transition-all hover:cursor-pointer [&:not(:last-child)]:mr-[9px] ${tabBorder}
							xl:w-[${tabMinWidth}px]`,
							tab.isActive && 'pointer-events-none border bg-black text-white'
						)}
					>
						{tab.title}
					</button>
				))}
			</nav>
		</div>
	)
}
