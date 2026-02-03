import type { Response } from 'express'
import { createMock } from '@golevelup/ts-jest'
import qs from 'qs'
import { convertToTitleCase, initialiseName, notFound, pathWithQuery, pluralise } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('notFound', () => {
  it('should set the status to 404 and render the error page', () => {
    const response = createMock<Response>({})
    notFound(response)

    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.render).toHaveBeenCalledWith('pages/error', { message: 'Page not found', status: 404 })
  })
})

describe('pluralise', () => {
  it('should pluralise basic English words', () => {
    expect(pluralise('Next session', 2)).toEqual('Next sessions')
    expect(pluralise('Appointment', 3)).toEqual('Appointments')
  })
  it('should pluralise English words with a different suffix', () => {
    expect(pluralise('Box', 4, 'es')).toEqual('Boxes')
    expect(pluralise('Ox', 5, 'en')).toEqual('Oxen')
  })
  it('should return the singular when there is only 1', () => {
    expect(pluralise('Next session', 1)).toEqual('Next session')
    expect(pluralise('Appointment', 1)).toEqual('Appointment')
    expect(pluralise('Ox', 1, 'en')).toEqual('Ox')
  })
  it('should not handle difficult Latin plurals, sadly', () => {
    expect(pluralise('Appendix', 3)).not.toEqual('Appendices')
    expect(pluralise('Datum', 3)).not.toEqual('Data')
  })
  it('should handle predefined inflections correctly', () => {
    expect(pluralise('person', 1)).toEqual('person')
    expect(pluralise('person', 2)).toEqual('people')
  })
})

describe('path with query', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('returns path joined with params', () => {
    jest.spyOn(qs, 'stringify').mockReturnValue('form=1')
    const result = pathWithQuery('/path', { form: '1' })
    expect(result).toEqual('/path?form=1')
  })

  it('returns a valid path even if the existing path has a ? in it', () => {
    const result = pathWithQuery('/path?foo=bar', { baz: 'quux' })
    expect(result).toEqual('/path?foo=bar&baz=quux')
  })

  it('returns a valid path even if the existing path has a ? in it and the query object has an empty value', () => {
    const result = pathWithQuery('/path?foo=bar', { baz: undefined })
    expect(result).toEqual('/path?foo=bar')
  })
})
