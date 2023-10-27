export const getTimeTuplePlusMinutes = (startTimeTuple: string[] | null, minutesPassed: number) => {
	const [hours, minutes] = startTimeTuple?.map(Number) ?? []
	const hoursPassed = Math.floor(minutesPassed / 60)
	const minutesPassedWoHours = minutesPassed - hoursPassed * 60
	const newMinutes =
		minutes + minutesPassedWoHours >= 60 ? minutes + minutesPassedWoHours - 60 : minutes + minutesPassedWoHours
	const newHours = hours + hoursPassed + (minutes + minutesPassedWoHours >= 60 ? 1 : 0)

	return [String(newHours), String(newMinutes).length === 1 ? `0${newMinutes}` : String(newMinutes)]
}