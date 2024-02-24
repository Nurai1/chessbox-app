module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es2021: true
	},
	parser: '@typescript-eslint/parser',
	plugins: [],
	extends: [
		'airbnb',
		'airbnb-typescript',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		"plugin:prettier/recommended"
	],
	rules: {
		'prettier/prettier': 'error',
		'no-param-reassign': [2, { props: false }],
		'prefer-arrow-callback': [2, { allowNamedFunctions: true }],
		'react/react-in-jsx-scope': 0,
		'react/require-default-props': 0,
		'react/prop-types': 0,
		'react/function-component-definition': [1, { namedComponents: 'arrow-function' }],
		'react/jsx-props-no-spreading': 0,
		'import/prefer-default-export': 0,
		'import/no-extraneous-dependencies': [
			2,
			{
				devDependencies: ['vite.config.ts', '**/*.stories.*']
			}
		],
		'jsx-a11y/label-has-associated-control': [
			2,
			{
				required: {
					some: ['nesting', 'id']
				}
			}
		],
		'arrow-body-style': 0,
		'no-underscore-dangle': ['error', { allow: ['_id'] }]
	},
	settings: {
		react: {
			version: 'detect'
		}
	},
	ignorePatterns: ['tailwind.config.js', 'generated.ts'],
	overrides: [
		{
			files: ['vite.config.ts', 'src/**/*.ts?(x)', 'global.d.ts'],
			parserOptions: {
				project: ['./tsconfig.json'],
				tsconfigRootDir: __dirname
			}
		},
		{
			files: ['src/**/*.stories.tsx'],
			parserOptions: {
				project: ['./tsconfig.json']
			},
			rules: {
				'react/jsx-props-no-spreading': 0
			}
		}
	]
}
