import { ErrorBoundary } from 'containers/ErrorBoundary'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SpinnerSuspense } from 'ui'
import App from './App'
import './index.css'

const container = document.querySelector('#root')
if (container) {
	const root = createRoot(container)
	root.render(
		<StrictMode>
			<ErrorBoundary>
				<SpinnerSuspense>
					<App />
				</SpinnerSuspense>
			</ErrorBoundary>
		</StrictMode>
	)
}
