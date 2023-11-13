import { AlertPropTypes } from 'src/ui/Alert/Alert'

type AlerType = Pick<AlertPropTypes, 'type' | 'title'>

export const copyToClipboard = (copy: string): AlerType => {
	// return object for alert
	try {
		navigator.clipboard.writeText(copy)
		return {
			type: 'success',
			title: 'Copied!'
		}
	} catch {
		return {
			type: 'error',
			title: 'Copy failed'
		}
	}
}
