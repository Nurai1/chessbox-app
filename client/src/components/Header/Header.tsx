import { ReactElement, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'src/hooks/redux'
import { useWindowSize } from 'usehooks-ts'
import { Burger, Modal } from 'src/ui'
import { UserMenu } from 'src/components/UserMenu'
import { logout } from 'src/store/slices/userSlice'
import { BreakPoint } from 'src/constants/breakPoints'
import { AuthorizationStatus } from 'src/constants/authorizationStatus'
import { AppRoute } from 'src/constants/appRoute'

export const Header = (): ReactElement => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const dispatch = useAppDispatch()
	const { pathname } = useLocation()
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

	return (
		<>
			<header className='border-b border-zinc-300'>
				<div className='container m-auto flex min-h-[3.75rem] items-center justify-between px-6 py-2 md:py-6 md:px-[1.875rem]'>
					{pathname === AppRoute.Root ? (
						<span className='text-2xl'>Logo</span>
					) : (
						<Link to={AppRoute.Root} className='transition hover:opacity-70'>
							Logo
						</Link>
					)}

					{screenWidth < BreakPoint.Xl && <Burger onClick={handleMenuOpen} />}

					{screenWidth >= BreakPoint.Xl && authorizationStatus === AuthorizationStatus.NoAuth && (
						<Link to={AppRoute.SignIn} className='font-bold transition hover:opacity-70'>
							Sign In
						</Link>
					)}

					{screenWidth >= BreakPoint.Xl && authorizationStatus === AuthorizationStatus.Auth && (
						<div>
							<Link to={AppRoute.EditProfile} className='mr-6 font-bold transition hover:opacity-70'>
								Profile
							</Link>
							<button onClick={handleLogOut} type='button' className='font-bold transition hover:opacity-70'>
								Sign Out
							</button>
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
