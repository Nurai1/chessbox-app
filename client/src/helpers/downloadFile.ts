export const downloadFile = ({ uri, filename }: { uri: string; filename?: string }) => {
	const link = document.createElement('a')

	link.setAttribute('href', uri)
	link.setAttribute('download', filename || 'file')
	link.style.display = 'none'
	document.body.appendChild(link)

	link.click()
	link.remove()
}
