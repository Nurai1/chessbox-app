type EnvType = 'local' | 'dev' | 'prod'

export const getEnv = (): EnvType => {
	const currentHost = window.location.hostname
	if (/.*localhost.*/.test(currentHost)) {
		return 'local'
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
	publicUrl: '',
	serviceApiUrl: 'https://eclectium0iuzdi5t-chessbox.functions.fnc.pl-waw.scw.cloud/api'
}
const prodConfig: AppConfig = {
	type: 'prod',
	publicUrl: '',
	serviceApiUrl: ''
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
