import { FC, ReactElement, ReactNode, useEffect, useRef } from 'react'
import { ReactComponent as XmarkIconBig } from 'src/assets/x-mark-big.svg'
import { ReactComponent as XmarkIcon } from 'src/assets/x-mark.svg'
import { useClickOutside } from 'src/hooks/useClickOutside'
import { twMerge } from 'tailwind-merge'

export const Modal: FC<{
	isOpen: boolean
	onClose?: () => void
	content: ReactElement
	title?: ReactNode
	submitButton?: ReactElement
	clearButton?: ReactElement
	modalType?: 'regular' | 'sideMenu'
	bottomGradient?: boolean
	classes?: string
	showModalHeader?: boolean
}> = ({
	isOpen,
	onClose,
	title,
	content,
	submitButton,
	clearButton,
	modalType = 'regular',
	bottomGradient,
	classes,
	showModalHeader = true
}) => {
	const modalRef = useRef(null)

	useClickOutside({
		element: modalRef.current,
		onClick: onClose,
		modalOptions: { isModal: true, isModalOpen: isOpen }
	})

	useEffect(() => {
		const onKeydown = (ev: KeyboardEvent) => {
			if (isOpen && ev.key === 'Escape') {
				onClose?.()
			}
		}

		document.addEventListener('keydown', onKeydown)

		return () => document.removeEventListener('keydown', onKeydown)
	}, [isOpen, onClose])

	const bottomGradientClass =
		'relative before:absolute before:bottom-0 before:w-full before:h-[92px] before:bg-gradient-to-t from-white before:to-white'

	return (
		<>
			{modalType === 'regular' && (
				<div className={twMerge(isOpen ? 'z-[60]' : 'z-[-100]', 'fixed inset-0 h-full w-full overflow-y-auto')}>
					<div
						ref={modalRef}
						className={twMerge(
							isOpen ? '-translate-y-1/2 opacity-100 duration-500' : '-translate-y-2/3 opacity-0',
							'absolute left-1/2 top-1/2 w-[calc(100%-52px)] -translate-x-1/2 shadow-xl transition-all ease-out lg:w-[667px]',
							submitButton && 'rounded-b-none',
							classes
						)}
					>
						<div className='relative rounded-[15px] bg-white px-[18px] py-[25px] md:px-[40px]'>
							<div className='mb-px flex min-h-[1.5rem]'>
								{clearButton}
								{onClose && (
									<button
										type='button'
										className='z-10 ml-auto focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white'
										onClick={onClose}
									>
										<span className='sr-only'>Close</span>
										<XmarkIcon onClick={onClose} className='transition hover:opacity-70' />
									</button>
								)}
							</div>

							<h2 className='flex-center mt-[-27px] w-full text-2xl font-semibold leading-none text-gray-800'>
								{title}
							</h2>
							<div className='mt-[30px]'>{isOpen ? content : null}</div>
							{submitButton && <div className='mt-[25px] md:mt-[35px]'>{submitButton}</div>}
						</div>
					</div>
				</div>
			)}

			{modalType === 'sideMenu' && (
				<div
					ref={modalRef}
					className={twMerge(
						isOpen ? 'right-0' : 'right-[-100%]',
						'inset fixed top-0 z-30 h-full w-full transition-all duration-500 lg:w-[516px] xl:w-[587px]'
					)}
				>
					<div
						className={twMerge(
							'flex h-full max-h-screen flex-col bg-white lg:rounded-l-[24px] lg:border lg:shadow-[0px_16px_60px_0px_rgba(0,0,0,0.25)]',
							bottomGradient && bottomGradientClass,
							classes
						)}
					>
						{showModalHeader && (
							<div className='flex-center min-h-[3.75rem] px-6 py-2 md:py-6 md:px-[1.875rem]'>
								<h2 className='text-2xl font-bold xl:text-4xl'>{title}</h2>
								<button
									type='button'
									className='ml-auto focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white'
									onClick={onClose}
								>
									<span className='sr-only'>Close</span>
									<XmarkIconBig onClick={onClose} className='w-[20px] transition hover:opacity-70' />
								</button>
							</div>
						)}
						<div className='scroll-custom grow overflow-y-auto'>{isOpen ? content : null}</div>
					</div>
				</div>
			)}

			{isOpen && modalType === 'regular' && (
				<div className='duration fixed inset-0 z-50 bg-gray-900 bg-opacity-50 transition' />
			)}
		</>
	)
}
