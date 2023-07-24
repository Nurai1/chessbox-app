import { FC } from 'react'

type LabelPropsType = { label?: string; showOptional?: boolean; htmlFor?: string }
export const Label: FC<LabelPropsType> = ({ label, showOptional, htmlFor }) => {
	return (
		<div className='flex w-full'>
			{label && (
				<label className='pb-[0.625rem] text-sm text-[#6C6A6C]' htmlFor={htmlFor}>
					{label}
				</label>
			)}
			{showOptional && <span className='flex-grow pb-[0.625rem] text-right text-slate-500'>Optional</span>}
		</div>
	)
}
