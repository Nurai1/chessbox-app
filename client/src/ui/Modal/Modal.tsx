import { ReactComponent as XmarkIcon } from 'src/assets/x-mark-big.svg'
import { useClickOutside } from 'src/hooks/useClickOutside'
import { FC, ReactElement, ReactNode, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from 'src/ui'

export const Modal: FC<{
	isOpen: boolean
	onClose: () => void
	content: ReactElement
	title: ReactNode
	submitButton?: ReactElement
}> = ({ isOpen, onClose, title, content, submitButton }) => {
	const modalRef = useRef(null)

	useClickOutside({
		element: modalRef.current,
		onClick: onClose,
		modalOptions: { isModal: true, isModalOpen: isOpen }
	})

	useEffect(() => {
		const onKeydown = (ev: KeyboardEvent) => {
			if (isOpen && ev.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('keydown', onKeydown)

		return () => document.removeEventListener('keydown', onKeydown)
	}, [isOpen, onClose])

	return (
		<>
			<div className={twMerge(isOpen ? 'z-[60]' : 'z-[-100]', 'fixed inset-0 h-full w-full overflow-y-auto')}>
				<div
					ref={modalRef}
					className={twMerge(
						isOpen ? '-translate-y-1/2 opacity-100 duration-500' : '-translate-y-2/3 opacity-0',
						'absolute left-1/2 top-1/2 m-3 w-[530px] -translate-x-1/2 shadow-xl transition-all ease-out',
						submitButton && 'rounded-b-none'
					)}
				>
					<div className={twMerge('rounded-2xl bg-white p-5 shadow-xl', submitButton && 'rounded-b-none')}>
						<div className='mb-px flex justify-end'>
							<button
								type='button'
								className='inline-flex-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white'
								onClick={onClose}
							>
								<span className='sr-only'>Close</span>
								<XmarkIcon onClick={onClose} className='hover:stroke-gray-500' />
							</button>
						</div>
						<div className='flex-center w-full text-xl font-bold leading-none text-gray-800'>{title}</div>
						<div className='mx-5 mt-5'>{isOpen ? content : null}</div>
					</div>
					{submitButton && (
						<div className='flex justify-end gap-[10px] rounded-b-2xl border-t border-gray-200 bg-gray-50 p-5'>
							<Button type='ghost' onClick={onClose}>
								Cancel
							</Button>
							{submitButton}
						</div>
					)}
				</div>
			</div>
			{isOpen && <div className='duration fixed inset-0 z-50 bg-gray-900 bg-opacity-50 transition' />}
		</>
	)
}
