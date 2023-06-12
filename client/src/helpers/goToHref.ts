export const goToHref = (uri: string) => {
	const hasHttpMatches = uri.match(/http(s)?:\/\//)

	window.location.href = hasHttpMatches ? uri : `https://${uri}`
}
