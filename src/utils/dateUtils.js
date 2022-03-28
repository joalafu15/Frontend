import * as dayjs from 'dayjs'
import { DateObject } from 'react-multi-date-picker'

export const getAge = (birthday) => {
  const birthYear = dayjs(birthday).year()
  const currentYear = dayjs().year()
  return currentYear - birthYear
}

/**
 *
 * @param {*} date
 * @param {*} format
 * @returns
 */
export const getFormatDateObject = (date) => {
  if (!date) {
    throw Error('missing params date')
  }
  const dateObject = new DateObject(date)
  return {
    date: dateObject.format('YYYY/MM/DD'),
    time: dateObject.format('HH:mm A'),
  }
}
