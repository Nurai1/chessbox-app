import { FC } from 'react'
import { twMerge } from 'tailwind-merge'
import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'
import { LanguagesList } from '../../i18n/lang_list'
import { Select } from './Select'

export const LanguageSelect: FC<{ className?: string }> = ({ className }) => {
	const { i18n } = useOptionalTranslation()

	return (
		<div className={twMerge('w-[45px]', className)}>
			<Select
				chosenId={i18n.language}
				onChange={val => {
					i18n.changeLanguage(val)
				}}
				menuOptions={LanguagesList}
				selectClasses='border-0 px-1 [&~svg]:right-1 [&~svg]:w-3'
			/>
		</div>
	)
}
