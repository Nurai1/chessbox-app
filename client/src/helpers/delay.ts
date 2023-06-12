export const delay = (num = 1500) =>
	new Promise(res => {
		setTimeout(res, num)
	})
