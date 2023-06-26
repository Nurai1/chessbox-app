import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppRoute } from 'src/constants/appRoute'
import { Route404 } from 'src/routes/404'
import { MainPage } from 'src/routes/MainPage'
import { UILibrary } from 'src/routes/UILibrary'
import { Competitions } from './routes/Competitions'

const App = () => {
	return (
		<div className='flex h-screen'>
			<HashRouter>
				<div className='w-full overflow-y-auto'>
					<Routes>
						<Route element={<MainPage />} path={AppRoute.Root} />
						<Route element={<UILibrary />} path={AppRoute.UILibrary} />
						<Route element={<Competitions />} path={AppRoute.Competitions} />
						<Route element={<Route404 />} path={AppRoute.NotFound} />
					</Routes>
				</div>
			</HashRouter>
		</div>
	)
}

export default App
