module.exports = {
	'*.{ts,tsx}': [
		() => 'tsc --skipLibCheck --noEmit',
		'eslint --cache --max-warnings=1 --fix --ignore-path .gitignore --ext .ts,.tsx'
	]
}
