export const addZero = (value: string): string => {
	return value.toString().length === 1 ? `0${value}` : value
}
