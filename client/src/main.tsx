import { ErrorBoundary } from 'containers/ErrorBoundary'
import { ToastContainer } from 'containers/ToastContainer'
import { Provider as JotaiProvider } from 'jotai'
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
			<JotaiProvider>
				<ErrorBoundary>
					<SpinnerSuspense>
						<ToastContainer>
							<App />
						</ToastContainer>
					</SpinnerSuspense>
				</ErrorBoundary>
			</JotaiProvider>
		</StrictMode>
	)
}
