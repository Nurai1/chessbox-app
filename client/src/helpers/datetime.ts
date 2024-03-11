import * as dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import * as isYesterday from 'dayjs/plugin/isYesterday'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime)
dayjs.extend(isYesterday)
dayjs.extend(isSameOrBefore)
dayjs.extend(utc)
dayjs.extend(customParseFormat)
dayjs.extend(timezone)

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
export const localTZName = dayjs.tz.guess().split('/').join(' - ')

export const getISODateTimeStringFromFormat = (date: string, format = 'MM/DD/YYYY') => {
	return dayjs(date, format).utc().hour(0).format()
}

export const subtractMinutes = (date: string, minutes: number) => {
	return dayjs(date).subtract(minutes, 'minutes').utc().format()
}

export const getEndTime = (endTime: string) => {
	const registrationEndTime = dayjs(endTime).valueOf()
	const timeDiff = registrationEndTime - Date.now()
	const days = Math.floor(timeDiff / 86400000)
	const hours = Math.floor((timeDiff % 86400000) / 3600000)
	const minutes = Math.floor(((timeDiff % 86400000) % 3600000) / 60000)
	const seconds = Math.floor((((timeDiff % 86400000) % 3600000) % 60000) / 1000)

	return { days, hours, minutes, seconds }
}

export const getEndTimeBySeconds = (secondsLeft: number) => {
	const days = Math.floor(secondsLeft / 86400000)
	const hours = Math.floor((secondsLeft % 86400000) / 3600000)
	const minutes = Math.floor(((secondsLeft % 86400000) % 3600000) / 60000)
	const seconds = Math.floor((((secondsLeft % 86400000) % 3600000) % 60000) / 1000)

	return { days, hours, minutes, seconds }
}

export const calcTime = ({
	time,
	perMinute = true
}: {
	time: {
		minutes: number
		hours: number
		days: number
		seconds: number
	}
	perMinute?: boolean
}) => {
	const getMinutes = () => {
		if (!perMinute) {
			if (time.minutes > 0 && time.seconds === 0) {
				return time.minutes - 1
			}

			if (time.minutes === 0 && time.seconds === 0) {
				return 59
			}

			return time.minutes
		}

		if (time.minutes === 0) {
			return 59
		}

		return time.minutes - 1
	}

	const getHours = () => {
		if (!perMinute) {
			if (time.seconds === 0 && time.minutes === 0 && time.hours > 0) {
				return time.hours - 1
			}

			return time.hours
		}

		if (time.minutes === 0 && time.hours === 0) {
			return 23
		}

		if (time.minutes === 0 && time.hours > 0) {
			return time.hours - 1
		}

		return time.hours
	}

	const getDays = () => {
		if (!perMinute) {
			return 0
		}

		if (time.minutes === 0 && time.hours === 0 && time.days > 0) {
			return time.days - 1
		}

		return time.days
	}

	const getSeconds = () => {
		if (perMinute) {
			return 0
		}

		if (time.seconds === 0) {
			return 59
		}

		return time.seconds - 1
	}

	if (time.minutes === 0 && time.hours === 0 && time.days === 0 && time.seconds === 0) {
		return {
			minutes: 0,
			hours: 0,
			days: 0,
			seconds: 0
		}
	}

	return {
		minutes: getMinutes(),
		hours: getHours(),
		days: getDays(),
		seconds: getSeconds()
	}
}

export const isPast = (time: string) => new Date(time).getTime() < new Date().getTime()

export const isFuture = (time: string) => new Date(time).getTime() > new Date().getTime()

export const max99years = (time: string) => {
	const years99 = 3124202400000
	const is99yearsOver = Date.now() - years99

	if (Date.parse(time) < is99yearsOver) {
		return true
	}

	return false
}

export const getAge = (time?: string) => {
	return time && dayjs().diff(time, 'year')
}
