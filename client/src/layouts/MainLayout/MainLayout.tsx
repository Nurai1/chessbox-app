import { ReactElement, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from 'src/components'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchUserById } from '../../store/slices/userSlice'
import { Button, Modal } from '../../ui'

export const MainLayout = (): ReactElement => {
	const { authorizedUser: user, loading: userLoading } = useAppSelector(state => state.user)
	const [showI18nWarningModal, setShowI18nWarningModal] = useState(!localStorage.getItem('showedI18nWarningModal'))
	const [showBlockEmailConfirmModal, setShowBlockEmailConfirmModal] = useState(false)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (user && !user.emailConfirmed) {
			setShowBlockEmailConfirmModal(true)
		} else if (user && user.emailConfirmed) {
			setShowBlockEmailConfirmModal(false)
		}
	}, [user])

	return (
		<div className='ios_scroll_issue relative flex h-screen min-h-screen flex-col overflow-x-hidden'>
			<Header />
			<Outlet />
			<Modal
				isOpen={showI18nWarningModal}
				onClose={() => {
					setShowI18nWarningModal(false)
					localStorage.setItem('showedI18nWarningModal', 'true')
				}}
				modalType='regular'
				content={<div className='flex-center'>Вы можете менять язык справа сверху в приложении.</div>}
				title='Русский язык появился!'
				submitButton={
					<Button
						type='primary'
						classes='w-full'
						onClick={() => {
							setShowI18nWarningModal(false)
							localStorage.setItem('showedI18nWarningModal', 'true')
						}}
					>
						Закрыть
					</Button>
				}
			/>
			<Modal
				isOpen={showBlockEmailConfirmModal}
				modalType='regular'
				content={
					<div className='flex-center'>
						Пожалуйста, подтвердите почту. После подтверждения нажмите на кнопку. Если почта не подтверждена, это окно
						не закроется.
					</div>
				}
				title='Подтвердите почту'
				submitButton={
					<Button
						type='primary'
						classes='w-full'
						loading={userLoading}
						onClick={() => {
							if (user?._id) dispatch(fetchUserById(user?._id))
						}}
					>
						Подтвердил(а)
					</Button>
				}
			/>
		</div>
	)
}
