import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type TableWrapperPropsType = {
	children: ReactNode | ReactNode[]
	classes?: string
}

export const RoundedBorderWrapper: FC<TableWrapperPropsType> = ({ children, classes }) => {
	return (
		<div className={twMerge(
			'xl:px[50px] flex grow flex-col md:rounded-3xl md:border md:border-[#DADADA] md:px-[40px] md:pt-[33px] xl:pt-[63px]',
			classes
		)}>
			{children}
		</div>
	)
}
