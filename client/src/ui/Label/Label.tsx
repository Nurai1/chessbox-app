import { FC } from 'react'

type LabelPropsType = { label?: string; showOptional?: boolean }
export const Label: FC<LabelPropsType> = ({ label, showOptional }) => {
	return (
		<div className='flex w-full'>
			{label && <span className='pb-[0.625rem] font-semibold text-gray-800'>{label}</span>}
			{showOptional && <span className='flex-grow pb-[0.625rem] text-right text-slate-500'>Optional</span>}
		</div>
	)
}
