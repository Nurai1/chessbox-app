import { MutableRefObject } from 'react'
import { AlertPropTypes } from 'src/ui/Alert/Alert'

type AlerType = Pick<AlertPropTypes, 'type' | 'title'>

export const copyToClipboard = (ref: MutableRefObject<HTMLElement>): AlerType => {
	// return object for alert
	try {
		navigator.clipboard.writeText(ref.current?.innerText)
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
