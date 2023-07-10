import { ReactComponent as XmarkIcon } from 'src/assets/x-mark.svg'
import { useClickOutside } from 'src/hooks/useClickOutside'
import { FC, ReactElement, ReactNode, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

export const Modal: FC<{
	isOpen: boolean
	onClose: () => void
	content: ReactElement
	title: ReactNode
	submitButton?: ReactElement
	clearButton?: ReactElement
}> = ({ isOpen, onClose, title, content, submitButton, clearButton }) => {
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
						'absolute left-1/2 top-1/2 w-[calc(100%-52px)] -translate-x-1/2 shadow-xl transition-all ease-out lg:w-[667px]',
						submitButton && 'rounded-b-none'
					)}
				>
					<div className='relative rounded-[15px] bg-white px-[18px] py-[25px] md:px-[40px]'>
						<div className='mb-px flex'>
							{clearButton}
							<button
								type='button'
								className='ml-auto focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white'
								onClick={onClose}
							>
								<span className='sr-only'>Close</span>
								<XmarkIcon onClick={onClose} className='transition hover:opacity-70' />
							</button>
						</div>
						<h2 className='flex-center mt-[-27px] w-full text-2xl font-semibold leading-none text-gray-800'>{title}</h2>
						<div className='mt-[30px] mb-[25px] md:mb-[35px]'>{isOpen ? content : null}</div>
						{submitButton && submitButton}
					</div>
				</div>
			</div>
			{isOpen && <div className='duration fixed inset-0 z-50 bg-gray-900 bg-opacity-50 transition' />}
		</>
	)
}
