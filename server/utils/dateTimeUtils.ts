import { format, parseISO } from 'date-fns'
import InvalidDateStringError from '../errors/invalidDateStringError'

interface DateFormatOptions {
  format: 'short' | 'medium' | 'long' | 'dashed'
}

export default class DateTimeFormats {
  /**
   * @param isoDate an ISO date string.
   * @returns the date in the to be shown in the UI: "Thursday, 20 December 2012".
   */
  static isoDateToUIDate(isoDate: string, options: DateFormatOptions = { format: 'long' }) {
    return DateTimeFormats.dateObjtoUIDate(DateTimeFormats.isoToDateObj(isoDate), options)
  }

  /**
   * @param date JS Date object.
   * @returns the date in the to be shown in the UI: "Thursday, 20 December 2012".
   */
  static dateObjtoUIDate(date: Date, options: DateFormatOptions = { format: 'long' }) {
    if (options.format === 'long') {
      return format(date, 'cccc d MMMM y')
    }
    if (options.format === 'medium') {
      return format(date, 'd MMMM y')
    }
    if (options.format === 'dashed') {
      return format(date, 'y-MM-dd')
    }
    return format(date, 'dd/LL/y')
  }

  /**
   * Converts an ISO8601 datetime string into a Javascript Date object.
   * @param date An ISO8601 datetime string
   * @returns A Date object
   * @throws {InvalidDateStringError} If the string is not a valid ISO8601 datetime string
   */
  static isoToDateObj(date: string) {
    const parsedDate = parseISO(date)

    if (Number.isNaN(parsedDate.getTime())) {
      throw new InvalidDateStringError(`Invalid Date: ${date}`)
    }

    return parsedDate
  }

  /**
   * Formats a time string into HH:MM format, removing any trailing :SS.
   * @param string a time string
   * @returns A string
   */
  static stripTime(time: string) {
    if (!DateTimeFormats.isValidTime(time)) {
      throw new InvalidDateStringError(`Invalid time: ${time}`)
    }

    const timeParts = time.split(':')

    return `${timeParts[0]}:${timeParts[1]}`
  }

  /**
   * Check that a string is in the HH:MM or HH:MM:SS format (12 or 24 hour clock).
   * @param string a time string
   * @returns A boolean
   */
  static isValidTime(time: string): boolean {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]($|:[0-5][0-9]$)/.test(time)
  }

  /**
   * Check that a time in the HH:MM or HH:MM:SS format is after another given time in the same format.
   * @param string a time string
   * @returns A boolean
   */
  static isBeforeTime(time: string, timeToCompare: string) {
    const timeAsDate = DateTimeFormats.timeToDate(time)
    const timeToCompareAsDate = DateTimeFormats.timeToDate(timeToCompare)

    return timeAsDate < timeToCompareAsDate
  }

  private static timeToDate(time: string) {
    return new Date(`1970-01-01T${this.stripTime(time)}:00Z`)
  }
}
