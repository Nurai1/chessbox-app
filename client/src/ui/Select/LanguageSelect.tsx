import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'
import { LanguagesList } from '../../i18n/lang_list'
import { Select } from './Select'

export const LanguageSelect: FC<{ className?: string }> = ({ className }) => {
	const { i18n } = useOptionalTranslation()
	const chosenId = (i18n.language ?? i18n.resolvedLanguage)?.slice(0, 2)
	return (
		<div className={twMerge('w-[45px]', className)}>
			<Select
				chosenId={chosenId}
				onChange={val => {
					i18n.changeLanguage(val)
				}}
				menuOptions={LanguagesList}
				selectClasses='border-0 px-1 [&~svg]:right-1 [&~svg]:w-3'
			/>
		</div>
	)
}
