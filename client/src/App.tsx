import { HashRouter, Route, Routes } from 'react-router-dom'
import { Route404 } from 'routes/404'

const App = () => {
	return (
		<div className='flex h-screen'>
			<HashRouter>
				<div className='overflow-y-auto'>
					<Routes>
						<Route element={<Route404 />} path='*' />
					</Routes>
				</div>
			</HashRouter>
		</div>
	)
}

export default App
