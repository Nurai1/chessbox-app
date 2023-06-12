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

	return dayjsNow.to(datetimeDayjs)
}

export const getFormattedDate = (date: string, format = 'MMM D, YYYY') => dayjs(date).format(format)

export const getISODateTimeStringFromFormat = (date: string, format = 'MM/DD/YYYY') => {
	return dayjs(date, format).utc().hour(0).format()
}
