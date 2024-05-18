import { useTranslation, Trans } from 'react-i18next'
import { TOptions } from 'i18next'

type StringMap = Record<string, string>
export type OTFunction = (key: string | undefined, options?: TOptions<StringMap> | string) => string | undefined
export type TFunction = (key: string | undefined, options?: TOptions<StringMap> | string) => string
export const useOptionalTranslation = () => {
	const { t: i18nTranslation, i18n } = useTranslation()
	const t = i18nTranslation as TFunction
	const ot: OTFunction = (key: string | undefined, options?: TOptions<StringMap> | string) =>
		key && i18n.exists(key) ? t(key, options) : undefined
	const otExist = (key: string | undefined): key is string => !!ot(key)
	return { t, ot, otExist, Trans, i18n }
}
