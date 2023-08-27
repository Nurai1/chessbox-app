import { ReactElement, useState } from 'react'
import { Link, useLocation, NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { useWindowSize } from 'usehooks-ts'
import { twMerge } from 'tailwind-merge'
import { Burger, Modal } from 'src/ui'
import { ReactComponent as Logo } from 'src/assets/logo.svg'
import { UserMenu } from 'src/components/UserMenu'
import { logout } from 'src/store/slices/userSlice'
import { BreakPoint } from 'src/constants/breakPoints'
import { AuthorizationStatus } from 'src/constants/authorizationStatus'
import { AppRoute } from 'src/constants/appRoute'

export const Header = (): ReactElement => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const dispatch = useAppDispatch()
	const { pathname } = useLocation()
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
	}

	const activeLink = ({ isActive }: { isActive: boolean }) => (isActive ? { textDecoration: 'underline' } : {})

	return (
		<>
			<header className='border-b border-zinc-300'>
				<div
					className={twMerge(
						'container m-auto flex h-[3.75rem] items-center justify-between px-6 py-1 md:h-20 md:px-[1.875rem]',
						isRatingPage && 'h-[2.5rem] md:h-[2.5rem]'
					)}
				>
					{pathname === AppRoute.Root ? (
						<Logo />
					) : (
						<Link to={AppRoute.Root} className='transition hover:opacity-70'>
							<Logo className={isRatingPage ? 'w-[1.5rem]' : 'w-[3.25rem]'} />
						</Link>
					)}

					{screenWidth < BreakPoint.Xl && (
						<Burger classes={isRatingPage ? 'scale-75 translate-x-3' : ''} onClick={handleMenuOpen} />
					)}
					{screenWidth >= BreakPoint.Xl && (
						<div className={isRatingPage ? 'text-sm' : ''}>
							{authorizationStatus === AuthorizationStatus.NoAuth && (
								<>
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
										Rating
									</NavLink>
									<Link to={AppRoute.SignIn} className='font-bold transition hover:opacity-70'>
										Sign In
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
										Profile
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
										Rating
									</NavLink>
									<button onClick={handleLogOut} type='button' className='font-bold transition hover:opacity-70'>
										Sign Out
									</button>
								</>
							)}
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
