import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'
import { Route404 } from 'src/routes/404'
import { MainPage } from 'src/routes/MainPage'
import { UILibrary } from 'src/routes/UILibrary'
import { CompetitionsPage } from './routes/CompetitionsPage'
import { CompetitionPage } from './routes/CompetitionPage'
import { RatingPage } from './routes/RatingPage'

const App = () => {
	return (
		<div className='flex h-screen min-h-screen w-full flex-col'>
			<HashRouter>
				<Routes>
					<Route element={<MainPage />} path={AppRoute.Root} />
					<Route element={<UILibrary />} path={AppRoute.UILibrary} />
					<Route path={AppRoute.Competitions}>
						<Route index element={<CompetitionsPage />} />
						<Route element={<CompetitionPage />} path={AppRoute.Competition} />
					</Route>
					<Route element={<RatingPage />} path={AppRoute.Rating} />
					<Route element={<Route404 />} path={AppRoute.NotFound} />
				</Routes>
			</HashRouter>
		</div>
	)
}

export default App
