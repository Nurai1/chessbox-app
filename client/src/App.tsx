import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'
import { Role } from 'src/constants/role'
import { Route404 } from 'src/routes/404'
import { UILibrary } from 'src/routes/UILibrary'
import { CompetitionsPage } from 'src/routes/CompetitionsPage'
import { CompetitionPage } from 'src/routes/CompetitionPage'
import { RatingPage } from 'src/routes/RatingPage'
import { SignUpPage } from 'src/routes/SignUpPage'
import { SignInPage } from 'src/routes/SignInPage'
import { EditProfilePage } from 'src/routes/EditProfilePage'
import { ForgotPasswordPage } from 'src/routes/ForgotPasswordPage'
import { ChangePasswordPage } from 'src/routes/ChangePasswordPage'
import { JudgeChoicePage } from 'src/routes/JudgeChoicePage'
import { CreateGroupPage } from 'src/routes/CreateGroupPage'
import { PrivateRoute } from 'src/components/PrivateRoute'
import { JudgeAssignPage } from 'src/routes/JudgeAssignPage'
import { useAppDispatch } from 'src/hooks/redux'
import { checkAuth } from 'src/store/slices/userSlice'
import { MainLayout } from 'src/layouts'

const App = () => {
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(checkAuth())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<HashRouter>
			<Routes>
				<Route path={AppRoute.Root} element={<MainLayout />}>
					<Route index element={<Navigate to={AppRoute.Competitions} replace />} />
					<Route element={<UILibrary />} path={AppRoute.UILibrary} />
					<Route path={AppRoute.Competitions}>
						<Route index element={<CompetitionsPage />} />
						<Route path={AppRoute.Competition}>
							<Route index element={<CompetitionPage />} />
							<Route element={<JudgeAssignPage />} path={AppRoute.JudgeAssign} />
							<Route
								path={AppRoute.JudgeChoice}
								element={
									<PrivateRoute role={Role.ChiefJudge} redirectPath={`/${AppRoute.Competitions}`}>
										<JudgeChoicePage />
									</PrivateRoute>
								}
							/>
							<Route
								path={AppRoute.CreateGroup}
								element={
									<PrivateRoute role={Role.ChiefJudge} redirectPath={`/${AppRoute.Competitions}`}>
										<CreateGroupPage />
									</PrivateRoute>
								}
							/>
						</Route>
					</Route>
					<Route element={<RatingPage />} path={AppRoute.Rating} />
					<Route element={<SignUpPage />} path={AppRoute.SignUp} />
					<Route element={<SignInPage />} path={AppRoute.SignIn} />
					<Route
						path={AppRoute.EditProfile}
						element={
							<PrivateRoute>
								<EditProfilePage />
							</PrivateRoute>
						}
					/>
					<Route element={<ForgotPasswordPage />} path={AppRoute.ForgotPassword} />
					<Route element={<ChangePasswordPage />} path={AppRoute.ChangePassword} />
					<Route element={<Route404 />} path={AppRoute.NotFound} />
				</Route>
			</Routes>
		</HashRouter>
	)
}

export default App
