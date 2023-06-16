import { HashRouter, Route, Routes } from 'react-router-dom'
import { Route404 } from 'routes/404'
import { UILibrary } from 'routes/UILibrary'
import { AppRoute } from './constants/appRoute'

const App = () => {
	return (
		<div className='flex h-screen'>
			<HashRouter>
				<div className='overflow-y-auto w-full'>
					<Routes>
						<Route element={<UILibrary />} path={AppRoute.UILibrary} />
						<Route element={<Route404 />} path={AppRoute.NotFound} />
					</Routes>
				</div>
			</HashRouter>
		</div>
	)
}

export default App
