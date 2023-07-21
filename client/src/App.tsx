import { useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'
import { Route404 } from 'src/routes/404'
import { MainPage } from 'src/routes/MainPage'
import { UILibrary } from 'src/routes/UILibrary'
import { CompetitionsPage } from 'src/routes/CompetitionsPage'
import { CompetitionPage } from 'src/routes/CompetitionPage'
import { RatingPage } from 'src/routes/RatingPage'
import { SignUpPage } from 'src/routes/SignUpPage'
import { SignInPage } from 'src/routes/SignInPage'
import { useAppDispatch } from 'src/hooks/redux'
import { PrivateRoute } from 'src/components/PrivateRoute'
import { checkAuth } from 'src/store/slices/userSlice'

const App = () => {
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(checkAuth())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className='relative flex h-screen min-h-screen flex-col overflow-x-hidden'>
			<HashRouter>
				<Routes>
					<Route element={<MainPage />} path={AppRoute.Root} />
					<Route element={<UILibrary />} path={AppRoute.UILibrary} />
					<Route path={AppRoute.Competitions}>
						<Route index element={<CompetitionsPage />} />
						<Route element={<CompetitionPage />} path={AppRoute.Competition} />
					</Route>
					<Route
						element={
							<PrivateRoute>
								<RatingPage />
							</PrivateRoute>
						}
						path={AppRoute.Rating}
					/>
					<Route element={<RatingPage />} path={AppRoute.Rating} />
					<Route element={<SignUpPage />} path={AppRoute.SignUp} />
					<Route element={<SignInPage />} path={AppRoute.SignIn} />
					<Route element={<Route404 />} path={AppRoute.NotFound} />
				</Routes>
			</HashRouter>
		</div>
	)
}

export default App
