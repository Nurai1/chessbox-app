const defaultConfig = require('tailwindcss/defaultConfig')
const colors = require('tailwindcss/colors')
const formsPlugin = require('@tailwindcss/forms')

/** @type {import('tailwindcss/types').Config} */
const config = {
	content: ['node_modules/preline/dist/*.js', 'index.html', 'src/**/*.tsx', 'src/**/*.css'],
	safelist: ['fill-blue-500'],
	theme: {
		fontFamily: {
			sans: ['Hubot Sans', ...defaultConfig.theme.fontFamily.sans]
		},
		screens: {
			...defaultConfig.theme.screens,
			sm: '375px',
			md: '536px',
			lg: '744px',
			xl: '1200px',
			'2xl': '1440px'
		},
		extend: {
			fontSize: {
				input: ['15px', '15px'],
				'heading-1': ['3.375rem', { lineHeight: '1.5', fontWeight: 700 }],
				'heading-2': ['2.25rem', { lineHeight: '1.5', fontWeight: 700 }],
				'heading-3': ['2rem', { lineHeight: '1.5', fontWeight: 600 }],
				'heading-4': ['1.5rem', { lineHeight: '1.5', fontWeight: 600 }],
				'heading-6': ['1.25rem', { lineHeight: '1.5', fontWeight: 600 }],
				'body-1': ['1.25rem', { lineHeight: '1.5', fontWeight: 500 }],
				'body-2': ['1rem', { lineHeight: '1.5', fontWeight: 400 }]
			},
			height: {
				input: ['15px']
			},
			animation: {
				'show-left': 'show-left 0.5s ease-in-out',
				'show-bottom': 'show-bottom 0.2s ease-in-out'
			},
			keyframes: {
				['show-left']: {
					'0%': { transform: 'translateX(-80px)', opacity: 0 }
				},
				['show-bottom']: {
					'0%': { transform: 'translateY(20px)', opacity: 0 }
				}
			},
			container: {
				screens: {
					'2xl': '1440px'
				}
			},
			colors: {
				black: '#09090C',
				grey: '#6C6A6C',
				'light-grey': '#F2F2F2',
				'pale-white': '#FDFDFD'
			}
		}
	},
	plugins: [
		formsPlugin,
		colors,
		function ({ addVariant }) {
			addVariant('child', '& > *')
			addVariant('hover-child', '&:hover > *')
		}
	]
}
module.exports = config
