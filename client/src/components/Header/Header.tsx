import { ReactElement, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ReactComponent as Logo } from 'src/assets/logo.svg'
import { UserMenu } from 'src/components/UserMenu'
import { AppRoute } from 'src/constants/appRoute'
import { AuthorizationStatus } from 'src/constants/authorizationStatus'
import { BreakPoint } from 'src/constants/breakPoints'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { logout } from 'src/store/slices/userSlice'
import { Burger, Modal } from 'src/ui'
import { twMerge } from 'tailwind-merge'
import { useWindowSize } from 'usehooks-ts'
import { useOptionalTranslation } from '../../hooks/useOptionalTranslation'
import { LanguageSelect } from '../../ui/Select/LanguageSelect'

export const Header = (): ReactElement => {
	const { t } = useOptionalTranslation()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const dispatch = useAppDispatch()
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const isRatingPage = pathname.includes(AppRoute.Rating)
	const { width: screenWidth } = useWindowSize()
	const authorizationStatus = useAppSelector(state => state.user.authorizationStatus)

	const handleMenuOpen = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const handleLogOut = () => {
		dispatch(logout())
		if (screenWidth < BreakPoint.Xl) {
			setIsMenuOpen(!isMenuOpen)
		}
		navigate(`/${AppRoute.SignIn}`)
	}

	const activeLink = ({ isActive }: { isActive: boolean }) => (isActive ? { textDecoration: 'underline' } : {})

	return (
		<>
			<header className='border-b border-zinc-300'>
				<div
					className={twMerge(
						'container m-auto flex h-[3.75rem] items-center justify-between px-6 py-1 md:h-20 md:px-[1.875rem]'
					)}
				>
					{pathname === AppRoute.Root ? (
						<Logo />
					) : (
						<Link to={AppRoute.Root} className='transition hover:opacity-70'>
							<Logo className='w-[3.25rem]' />
						</Link>
					)}

					{screenWidth < BreakPoint.Xl && (
						<div className='flex items-center'>
							<LanguageSelect className='mr-2' />
							<Burger classes={isRatingPage ? 'scale-75 translate-x-3' : ''} onClick={handleMenuOpen} />
						</div>
					)}
					{screenWidth >= BreakPoint.Xl && (
						<div className={twMerge('flex items-center', isRatingPage ? 'text-sm' : '')}>
							{authorizationStatus === AuthorizationStatus.NoAuth && (
								<>
									<NavLink
										to={AppRoute.Competitions}
										className='mr-6 font-bold transition hover:opacity-70'
										style={activeLink}
									>
										{t('competitions')}
									</NavLink>
									<NavLink
										to={AppRoute.Rating}
										className='mr-6 font-bold transition hover:opacity-70'
										style={activeLink}
									>
										{t('rating')}
									</NavLink>
									<Link to={AppRoute.SignIn} className='font-bold transition hover:opacity-70'>
										{t('signIn')}
									</Link>
								</>
							)}

							{authorizationStatus === AuthorizationStatus.Auth && (
								<>
									<NavLink
										to={AppRoute.EditProfile}
										className='mr-6 font-bold transition hover:opacity-70'
										style={activeLink}
									>
										{t('profile')}
									</NavLink>
									<NavLink
										to={AppRoute.Competitions}
										className='mr-6 font-bold transition hover:opacity-70'
										style={activeLink}
									>
										Competitions
									</NavLink>
									<NavLink
										to={AppRoute.Rating}
										className='mr-6 font-bold transition hover:opacity-70'
										style={activeLink}
									>
										{t('rating')}
									</NavLink>
									<button onClick={handleLogOut} type='button' className='font-bold transition hover:opacity-70'>
										Sign Out
									</button>
								</>
							)}
							<LanguageSelect className='ml-2' />
						</div>
					)}
				</div>
			</header>
			<Modal
				isOpen={isMenuOpen}
				onClose={handleMenuOpen}
				modalType='sideMenu'
				content={<UserMenu onLinkClick={handleMenuOpen} onLogoutClick={handleLogOut} />}
			/>
		</>
	)
}
