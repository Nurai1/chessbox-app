import { ReactElement } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Header } from 'src/components'
import { AppRoute } from '../../constants/appRoute'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { checkAuth, logout } from '../../store/slices/userSlice'
import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'
import { Button, Modal } from '../../ui'

export const MainLayout = (): ReactElement => {
	const { t } = useOptionalTranslation()
	const { authorizedUser: user, authLoading } = useAppSelector(state => state.user)
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { pathname } = useLocation()
	// Existing unconfirmed sessions can refresh their server-side status after
	// verification on another device. Never cover the confirmation link itself.
	const showBlockEmailConfirmModal = Boolean(
		user?.emailConfirmed === false && pathname !== `/${AppRoute.EmailConfirmation}`
	)

	return (
		<div className='ios_scroll_issue relative flex h-screen min-h-screen flex-col overflow-x-hidden'>
			<Header />
			<Outlet />
			<Modal
				isOpen={showBlockEmailConfirmModal}
				modalType='regular'
				content={<div className='flex-center'>{t('emailConfirmationRefreshHelp')}</div>}
				title={t('emailConfirmation')}
				submitButton={
					<div className='flex flex-col gap-2'>
						<Button
							type='ghost'
							classes='w-full'
							loading={authLoading}
							onClick={() => {
								dispatch(logout())
								navigate(`/${AppRoute.SignIn}`)
							}}
						>
							{t('signOut')}
						</Button>
						<Button
							type='primary'
							classes='w-full'
							loading={authLoading}
							onClick={() => {
								dispatch(checkAuth())
							}}
						>
							{t('emailConfirmationRefresh')}
						</Button>
					</div>
				}
			/>
		</div>
	)
}
