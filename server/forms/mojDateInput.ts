import { format, isValid, parse } from 'date-fns'
import InvalidDateStringError from '../errors/invalidDateStringError'

export default class MojDateInput {
  static validate(dateInput: string | undefined, label: string = 'date'): Record<'text', string> | undefined {
    const trimmedDateInput = dateInput?.trim()
    if (!trimmedDateInput) {
      return { text: `Enter or select a ${label}` }
    }

    if (!MojDateInput.isValid(trimmedDateInput)) {
      return { text: `Enter a real ${label} in the correct format. For example, 17/5/2024` }
    }

    return undefined
  }

  static isValid(trimmedDateInput: string | undefined): boolean {
    if (!trimmedDateInput) {
      return false
    }

    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmedDateInput)) {
      return false
    }

    const parsedDate = parse(trimmedDateInput, 'd/M/yyyy', new Date())
    if (!isValid(parsedDate)) {
      return false
    }

    return true
  }

  static toIsoDate(dateInput: string): string {
    if (!MojDateInput.isValid(dateInput)) {
      throw new InvalidDateStringError(`Invalid Date: ${dateInput}`)
    }

    const parsedDate = parse(dateInput.trim(), 'd/M/yyyy', new Date())
    return format(parsedDate, 'yyyy-MM-dd')
  }
}
