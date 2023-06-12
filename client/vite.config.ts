import react from '@vitejs/plugin-react'
import dns from 'dns'
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import { visualizer } from 'rollup-plugin-visualizer'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

dns.setDefaultResultOrder('verbatim')

export default defineConfig(() => ({
	optimizeDeps: {
		disabled: false
	},
	build: {
		sourcemap: false,
		commonjsOptions: {
			include: []
		}
	},
	plugins: [
		svgr({
			exportAsDefault: false
		}),
		react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
		visualizer() as PluginOption,
		tsconfigPaths(),
		checker({
			overlay: {
				initialIsOpen: true
			},
			typescript: true,
			eslint: {
				lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
			}
		})
	]
}))
