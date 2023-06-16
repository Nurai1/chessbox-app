import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

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
		react(),
		visualizer() as PluginOption,
		tsconfigPaths(),
		checker({
			overlay: {
				initialIsOpen: false
			},
			typescript: true,
			eslint: {
				lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
			}
		})
	]
}))
