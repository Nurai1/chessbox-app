type EnvType = 'local' | 'dev' | 'prod'

export const getEnv = (): EnvType => {
	const currentHost = window.location.hostname
	if (/.*localhost.*/.test(currentHost) || /.*127.0.0.1.*/.test(currentHost)) {
		return 'local'
	}

	// temporary mock for prod while users use this website as production
	if (currentHost === 'chessbox-app.pages.dev') {
		return 'prod'
	}

	if (/.dev/.test(currentHost)) {
		return 'dev'
	}
	return 'prod'
}

export interface AppConfig {
	type: 'local' | 'dev' | 'int' | 'test' | 'staging' | 'prod'
	publicUrl: string
	serviceApiUrl: string
}

const localConfig: AppConfig = {
	type: 'local',
	publicUrl: 'http://localhost:5173',
	serviceApiUrl: 'http://localhost:3001'
}

const devConfig: AppConfig = {
	type: 'dev',
	publicUrl: 'https://develop.chessbox-app.pages.dev',
	// serviceApiUrl: 'https://chessbox-server-268nq.ondigitalocean.app'
	serviceApiUrl: 'https://eclectium0iuzdi5t-chessbox.functions.fnc.pl-waw.scw.cloud'
}

const prodConfig: AppConfig = {
	type: 'prod',
	publicUrl: 'chessboxingfit.com',
	serviceApiUrl: 'https://chessbox-server-268nq.ondigitalocean.app'
}

const getConfig = (): AppConfig => {
	const env = getEnv()
	switch (env) {
		case 'local':
			return localConfig
		case 'dev':
			return devConfig
		case 'prod':
			return prodConfig
		default:
			throw new Error('Unknown env was used in app configuration')
	}
}

export default {
	...getConfig()
}
