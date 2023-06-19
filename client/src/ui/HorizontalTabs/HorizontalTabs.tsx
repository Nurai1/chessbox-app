import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

export type HorizontalTabsPropsType = {
	tabs: { isActive: boolean; title: string; onClick: (idx: number) => void }[]
}

export const HorizontalTabs: FC<HorizontalTabsPropsType> = ({ tabs }) => {
	const tabBorder =
		'after:absolute after:w-px after:h-full after:bg-[#DADADA] after:top-0 after:right-[-6px] last:after:content-none'
	return (
		<nav className='inline-flex h-[48px] rounded-lg border border-[#DADADA] bg-[#F2F2F2] p-1'>
			{tabs.map((tab, idx) => (
				<button
					// eslint-disable-next-line react/no-array-index-key
					key={idx}
					onClick={() => tab.onClick(idx)}
					type='button'
					className={twMerge(
						`relative h-full select-none rounded-lg border border-transparent px-3 py-2 text-base font-semibold text-[#6C6A6C] transition-all hover:cursor-pointer [&:not(:last-child)]:mr-[9px] ${tabBorder}`,
						tab.isActive && 'pointer-events-none border bg-black text-white'
					)}
				>
					{tab.title}
				</button>
			))}
		</nav>
	)
}
