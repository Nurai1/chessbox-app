import { Component, ReactNode } from 'react'

export class ErrorBoundary extends Component<{ children: ReactNode }, { errorText: string | null }> {
	constructor(props: { children: ReactNode }) {
		super(props)

		this.state = {
			errorText: null
		}
	}

	componentDidCatch(error: Error): void {
		this.setState({ errorText: error.message || 'Unknown error.' })
	}

	render() {
		const { children } = this.props
		const { errorText } = this.state

		if (errorText) {
			return (
				<div className='h-screen bg-slate-700 p-8 text-lg text-yellow-300'>
					<div>Something went wrong. Try reload the page.</div>
					Message: {errorText}
				</div>
			)
		}

		return children
	}
}
