import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isYesterday from 'dayjs/plugin/isYesterday';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(isYesterday);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const getDateAgoFormat = (datetime: string) => {
  const datetimeDayjs = dayjs(datetime);
  const dayjsNow = dayjs();

  if (datetimeDayjs.isYesterday()) {
    return 'yesterday';
  }

  if (datetimeDayjs.isSameOrBefore(dayjsNow.subtract(1, 'weeks'))) {
    return `${datetimeDayjs.format('MMM D')}th`;
  }

  return dayjsNow.to(datetimeDayjs, true);
};

export const getFormattedDate = (date: string, format = 'MMM D, YYYY') =>
  dayjs(date).format(format);

export const getUTCFormattedDate = (dayjsDate: dayjs.Dayjs, format?: string) =>
  dayjsDate.utc().format(format);

export const getISODateTimeStringFromFormat = (
  date: string,
  format = 'MM/DD/YYYY'
) => dayjs(date, format).utc().hour(0).format();

export const getEndTime = (endTime: string) => {
  const registrationEndTime = dayjs(endTime).valueOf();
  const timeDiff = registrationEndTime - Date.now();
  const days = Math.floor(timeDiff / 86400000);
  const hours = Math.floor((timeDiff % 86400000) / 3600000);
  const minutes = Math.floor(((timeDiff % 86400000) % 3600000) / 60000);

  return { days, hours, minutes };
};

export const isPast = (time: string) =>
  new Date(time).getTime() < new Date().getTime();
