import { useEffect, useRef } from 'react'

export function useClickOutside({
	element,
	onClick,
	modalOptions
}: {
	element: HTMLElement | null
	onClick?: () => void
	modalOptions?: { isModal: true; isModalOpen: boolean }
}) {
	const { isModal, isModalOpen } = modalOptions || {}

	const isElementTarget = useRef(false)
	const documentHandlerSkip = useRef(false)

	let currentElement = element
	if (isModal) {
		currentElement = isModalOpen ? element : null
	}

	useEffect(() => {
		if (isModal && isModalOpen) {
			documentHandlerSkip.current = true
		}
	}, [isModal, isModalOpen])

	useEffect(() => {
		const elementClickHandler = () => {
			isElementTarget.current = true
		}

		const documentClickHandler = () => {
			if (!isElementTarget.current && !documentHandlerSkip.current) {
				onClick?.()
			}

			documentHandlerSkip.current = false
			isElementTarget.current = false
		}

		if (currentElement) {
			currentElement.addEventListener('click', elementClickHandler)
			document.addEventListener('click', documentClickHandler)
		}
		return () => {
			if (currentElement) {
				currentElement.removeEventListener('click', elementClickHandler)
				document.removeEventListener('click', documentClickHandler)
			}
		}
	})
}
