import { FC, ReactNode } from 'react'
import { ReactComponent as CloseIcon } from 'src/assets/x-mark-circle.svg'
import { tv } from 'tailwind-variants'

type TagPropsType = {
	type?: 'primary' | 'search'
	img?: ReactNode
	text?: string | number
	onClick?: () => void
}

const tag = tv({
	base: 'inline-flex items-center gap-[9px] rounded-2xl py-1 px-4 whitespace-nowrap text-sm xl:text-base',
	variants: {
		tagType: {
			primary: 'bg-light-grey text-grey',
			search: 'bg-black text-pale-white gap-[13px]'
		}
	}
})

export const Tag: FC<TagPropsType> = ({ type = 'primary', img, text = '', onClick }) => {
	return (
		<div className={tag({ tagType: type })}>
			{type !== 'search' && img}
			{text}
			{type === 'search' && (
				<button type='button' className='transition hover:opacity-80' onClick={onClick}>
					<CloseIcon />
				</button>
			)}
		</div>
	)
}
