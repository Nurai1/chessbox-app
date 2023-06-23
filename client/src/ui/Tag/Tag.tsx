import { FC, ReactNode } from 'react'

type TagPropsType = {
	img: ReactNode
	text: string
}

export const Tag: FC<TagPropsType> = ({ img, text }) => {
	return (
		<div className='inline-flex items-center rounded-2xl bg-[#F2F2F2] py-1 px-4 text-sm text-[#6C6A6C] xl:text-base'>
			{img}
			{text}
		</div>
	)
}
