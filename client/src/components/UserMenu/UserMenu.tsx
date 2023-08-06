import { NavLink } from 'react-router-dom'
import { useAppSelector } from 'src/hooks/redux'
import { AppRoute } from 'src/constants/appRoute'
import { FC } from 'react'

type UserMenuPropsType = {
	onLinkClick: () => void
	onLogoutClick: () => void
}

export const UserMenu: FC<UserMenuPropsType> = ({ onLinkClick, onLogoutClick }) => {
	const authorizedUser = useAppSelector(state => state.user.authorizedUser)

	const activeLink = ({ isActive }: { isActive: boolean }) => (isActive ? { fontWeight: '600' } : {})
	return (
		<>
			{authorizedUser && (
				<>
					<div className='border-y border-zinc-300 px-6 py-5'>
						<h2 className='mb-2 text-2xl font-semibold'>{authorizedUser.fullName}</h2>
						<span className='text-neutral-500'>{authorizedUser.email}</span>
					</div>
					<ul className='px-6 py-[1.875rem]'>
						<li className='py-2.5'>
							<NavLink
								to={AppRoute.EditProfile}
								className='py-1 transition hover:opacity-70'
								style={activeLink}
								onClick={onLinkClick}
							>
								Profile
							</NavLink>
						</li>
						<li className='py-2.5'>
							<NavLink
								to={AppRoute.Competitions}
								className='py-1 transition hover:opacity-70'
								style={activeLink}
								onClick={onLinkClick}
							>
								Competitions
							</NavLink>
						</li>
						<li className='py-2.5'>
							<NavLink
								to={AppRoute.Rating}
								className='py-1 transition hover:opacity-70'
								style={activeLink}
								onClick={onLinkClick}
							>
								Rating
							</NavLink>
						</li>
						<li className='py-2.5'>
							<button type='button' onClick={onLogoutClick}>
								Sign Out
							</button>
						</li>
					</ul>
				</>
			)}
			{!authorizedUser && (
				<ul className='px-6 py-[1.875rem]'>
					<li className='py-2.5'>
						<NavLink to={AppRoute.SignIn} className='py-1 transition hover:opacity-70' onClick={onLinkClick}>
							Sign In
						</NavLink>
					</li>
					<li className='py-2.5'>
						<NavLink
							to={AppRoute.Competitions}
							className='py-1 transition hover:opacity-70'
							style={activeLink}
							onClick={onLinkClick}
						>
							Competitions
						</NavLink>
					</li>
					<li className='py-2.5'>
						<NavLink
							to={AppRoute.Rating}
							className='py-1 transition hover:opacity-70'
							style={activeLink}
							onClick={onLinkClick}
						>
							Rating
						</NavLink>
					</li>
				</ul>
			)}
		</>
	)
}
