import { ReactElement, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Header } from 'src/components'
import { AppRoute } from '../../constants/appRoute'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchUserById, logout } from '../../store/slices/userSlice'
import { Button, Modal } from '../../ui'

export const MainLayout = (): ReactElement => {
	const { authorizedUser: user, loading: userLoading } = useAppSelector(state => state.user)
	const [showBlockEmailConfirmModal, setShowBlockEmailConfirmModal] = useState(false)
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		// if user.emailConfirmed is undefined, it is an old user, whose email is not confirmed
		// we check only new users
		if (user && user.role === 'participant' && user.emailConfirmed === false) {
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
					<div className='flex flex-col gap-2'>
						<Button
							type='ghost'
							classes='w-full'
							loading={userLoading}
							onClick={() => {
								dispatch(logout())
								setShowBlockEmailConfirmModal(false)
								navigate(`/${AppRoute.SignIn}`)
							}}
						>
							Выйти из аккаунта
						</Button>
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
					</div>
				}
			/>
		</div>
	)
}
