import { HashRouter, Route, Routes } from 'react-router-dom'
import { Route404 } from 'routes/404'
import { Main } from 'routes/Main'
import { AppRoute } from './constants/appRoute'

const App = () => {
	return (
		<div className='flex h-screen'>
			<HashRouter>
				<div className='overflow-y-auto'>
					<Routes>
						<Route element={<Main />} path={AppRoute.Root} />
						<Route element={<Route404 />} path={AppRoute.NotFound} />
					</Routes>
				</div>
			</HashRouter>
		</div>
	)
}

export default App
