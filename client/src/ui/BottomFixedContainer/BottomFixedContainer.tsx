import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type BottomFixedContainerPropsType = {
	children: ReactNode
	classes?: string
}

export const BottomFixedContainer: FC<BottomFixedContainerPropsType> = ({ children, classes }) => {
	return (
		<div className='fixed bottom-0 left-0 z-10 w-full bg-white py-5 px-[1.12rem] shadow-[0px_16px_60px_0px_rgba(0,0,0,0.25)] xl:py-7'>
			<div className={twMerge('container m-auto', classes)}>{children}</div>
		</div>
	)
}
