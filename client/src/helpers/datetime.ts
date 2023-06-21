import * as dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import * as isYesterday from 'dayjs/plugin/isYesterday'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import * as utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime)
dayjs.extend(isYesterday)
dayjs.extend(isSameOrBefore)
dayjs.extend(utc)
dayjs.extend(customParseFormat)

export const getDateAgoFormat = (datetime: string) => {
	const datetimeDayjs = dayjs(datetime)
	const dayjsNow = dayjs()

	if (datetimeDayjs.isYesterday()) {
		return 'yesterday'
	}

	if (datetimeDayjs.isSameOrBefore(dayjsNow.subtract(1, 'weeks'))) {
		return `${datetimeDayjs.format('MMM D')}th`
	}

	return dayjsNow.to(datetimeDayjs, true)
}

export const getFormattedDate = (date: string, format = 'MMM D, YYYY') => dayjs(date).format(format)

export const getISODateTimeStringFromFormat = (date: string, format = 'MM/DD/YYYY') => {
	return dayjs(date, format).utc().hour(0).format()
}

export const getEndTime = (endTime: string) => {
	const registrationEndTime = dayjs(endTime).valueOf()
	const timeDiff = registrationEndTime - Date.now()
	const days = Math.floor(timeDiff / 86400000)
	const hours = Math.floor((timeDiff % 86400000) / 3600000)
	const minutes = Math.floor(((timeDiff % 86400000) % 3600000) / 60000)

	return { days, hours, minutes }
}

export const calcTime = (params: { minutes: number; hours: number; days: number }) => {
	const getMinutes = () => {
		if (params.minutes === 0) {
			return 59
		}

		return params.minutes - 1
	}

	const getHours = () => {
		if (params.minutes === 0 && params.hours === 0) {
			return 23
		}

		if (params.minutes === 0 && params.hours !== 0) {
			return params.hours - 1
		}

		return params.hours
	}

	const getDays = () => {
		if (params.minutes === 0 && params.hours === 0 && params.days !== 0) {
			return params.days - 1
		}

		return params.days
	}

	if (params.minutes === 0 && params.hours === 0 && params.days === 0) {
		params.minutes = 0
		params.hours = 0
		params.days = 0
		return params
	}

	return {
		minutes: getMinutes(),
		hours: getHours(),
		days: getDays()
	}
}
