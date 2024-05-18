import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PrivateRoute } from 'src/components/PrivateRoute'
import { AppRoute } from 'src/constants/appRoute'
import { Role } from 'src/constants/role'
import { useAppDispatch } from 'src/hooks/redux'
import { MainLayout } from 'src/layouts'
import { Route404 } from 'src/routes/404'
import { ChangePasswordPage } from 'src/routes/ChangePasswordPage'
import { CompetitionPage } from 'src/routes/CompetitionPage'
import { CompetitionsPage } from 'src/routes/CompetitionsPage'
import { CreateGroupPage } from 'src/routes/CreateGroupPage'
import { CreatePairsPage } from 'src/routes/CreatePairsPage'
import { EditProfilePage } from 'src/routes/EditProfilePage'
import { ForgotPasswordPage } from 'src/routes/ForgotPasswordPage'
import { JudgeAssignPage } from 'src/routes/JudgeAssignPage'
import { JudgeChoicePage } from 'src/routes/JudgeChoicePage'
import { JudgeCompetitionPage } from 'src/routes/JudgeCompetitionPage'
import { OrdersToGroupAssignPage } from 'src/routes/OrdersToGroupAssignPage'
import { RatingPage } from 'src/routes/RatingPage'
import { SignInPage } from 'src/routes/SignInPage'
import { SignUpPage } from 'src/routes/SignUpPage'
import { UILibrary } from 'src/routes/UILibrary'
import { VerifyPaymentPage } from 'src/routes/VerifyPaymentPage'
import { checkAuth } from 'src/store/slices/userSlice'
import { ConfirmationEmailPage } from './routes/ConfirmationEmailPage'
import 'src/i18n/i18n'

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
							<Route
								path={AppRoute.CreatePairs}
								element={
									<PrivateRoute role={Role.ChiefJudge} redirectPath={`/${AppRoute.Competitions}`}>
										<CreatePairsPage />
									</PrivateRoute>
								}
							/>
							<Route
								path={AppRoute.OrdersGroupAssign}
								element={
									<PrivateRoute role={Role.ChiefJudge} redirectPath={`/${AppRoute.Competitions}`}>
										<OrdersToGroupAssignPage />
									</PrivateRoute>
								}
							/>
							<Route
								path={AppRoute.JudgeAssign}
								element={
									<PrivateRoute role={Role.ChiefJudge} redirectPath={`/${AppRoute.Competitions}`}>
										<JudgeAssignPage />
									</PrivateRoute>
								}
							/>
							<Route
								path={AppRoute.JudgeCompetition}
								element={
									<PrivateRoute role={Role.ChiefJudge} redirectPath={`/${AppRoute.Competitions}`}>
										<JudgeCompetitionPage />
									</PrivateRoute>
								}
							/>
							<Route
								path={AppRoute.VerifyPayment}
								element={
									<PrivateRoute role={Role.ChiefJudge} redirectPath={`/${AppRoute.Competitions}`}>
										<VerifyPaymentPage />
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
							<PrivateRoute role={Role.Admin || Role.Judge || Role.ChiefJudge || Role.Participant}>
								<EditProfilePage />
							</PrivateRoute>
						}
					/>
					<Route element={<ForgotPasswordPage />} path={AppRoute.ForgotPassword} />
					<Route element={<ChangePasswordPage />} path={AppRoute.ChangePassword} />
					<Route element={<ConfirmationEmailPage />} path={AppRoute.EmailConfirmation} />
					<Route element={<Route404 />} path={AppRoute.NotFound} />
				</Route>
			</Routes>
		</HashRouter>
	)
}

export default App
