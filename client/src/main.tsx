import { ErrorBoundary } from 'src/containers/ErrorBoundary'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SpinnerSuspense } from 'src/ui'
import App from 'src/App'
import { Provider } from 'react-redux'
import './index.css'
import { store } from 'src/store'

const container = document.querySelector('#root')
if (container) {
	const root = createRoot(container)
	root.render(
		// <StrictMode>
			<ErrorBoundary>
				<Provider store={store}>
					<SpinnerSuspense>
						<App />
					</SpinnerSuspense>
				</Provider>
			</ErrorBoundary>
		// </StrictMode>
	)
}
