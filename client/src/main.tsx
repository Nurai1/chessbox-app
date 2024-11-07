import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from 'src/App'
import { ErrorBoundary } from 'src/containers/ErrorBoundary'
import { store } from 'src/store'
import { SpinnerSuspense } from 'src/ui'
import './index.css'

const container = document.querySelector('#root')
if (container) {
	const root = createRoot(container)
	root.render(
		<StrictMode>
			<ErrorBoundary>
				<Provider store={store}>
					<SpinnerSuspense>
						<App />
					</SpinnerSuspense>
				</Provider>
			</ErrorBoundary>
		</StrictMode>
	)
}
