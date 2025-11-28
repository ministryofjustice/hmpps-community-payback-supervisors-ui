import InvalidDateStringError from '../errors/invalidDateStringError'
import DateTimeFormats from './dateTimeUtils'

describe('DateTimeFormats', () => {
  describe('isoDateToUIDate', () => {
    it('converts a ISO8601 date string to a GOV.UK formatted date', () => {
      const date = '2022-11-11T00:00:00.000Z'

      expect(DateTimeFormats.isoDateToUIDate(date)).toEqual('Friday 11 November 2022')
    })

    it('raises an error if the date is not a valid ISO8601 date string', () => {
      const date = '23/11/2022'

      expect(() => DateTimeFormats.isoDateToUIDate(date)).toThrow(new InvalidDateStringError(`Invalid Date: ${date}`))
    })

    it('raises an error if the date is not a date string', () => {
      const date = 'NOT A DATE'

      expect(() => DateTimeFormats.isoDateToUIDate(date)).toThrow(new InvalidDateStringError(`Invalid Date: ${date}`))
    })
  })

  describe('dateObjToUiDate', () => {
    it('converts a date to a short format date', () => {
      const date = new Date('2022-11-11T00:00:00.000Z')

      expect(DateTimeFormats.dateObjtoUIDate(date, { format: 'short' })).toEqual('11/11/2022')
    })

    it('converts a date to a medium format date', () => {
      const date = new Date('2022-11-11T00:00:00.000Z')

      expect(DateTimeFormats.dateObjtoUIDate(date, { format: 'medium' })).toEqual('11 November 2022')
    })

    it('converts a date to a dashed format date', () => {
      const date = new Date('2022-11-11T00:00:00.000Z')

      expect(DateTimeFormats.dateObjtoUIDate(date, { format: 'dashed' })).toEqual('2022-11-11')
    })

    it('converts a date to a long format date', () => {
      const date = new Date('2022-11-11T00:00:00.000Z')

      expect(DateTimeFormats.dateObjtoUIDate(date)).toEqual('Friday 11 November 2022')
    })
  })

  describe('isoToDateObj', () => {
    it('converts a ISO8601 date string', () => {
      const date = '2022-11-11T00:00:00.000Z'

      expect(DateTimeFormats.isoToDateObj(date)).toEqual(new Date(2022, 10, 11))
    })

    it('raises an error if the date is not a valid ISO8601 date string', () => {
      const date = '23/11/2022'

      expect(() => DateTimeFormats.isoToDateObj(date)).toThrow(new InvalidDateStringError(`Invalid Date: ${date}`))
    })

    it('raises an error if the date is not a date string', () => {
      const date = 'NOT A DATE'

      expect(() => DateTimeFormats.isoToDateObj(date)).toThrow(new InvalidDateStringError(`Invalid Date: ${date}`))
    })
  })

  describe('stripTime', () => {
    it('strips ":SS" data from a time string', () => {
      const time = '23:12:12'

      expect(DateTimeFormats.stripTime(time)).toEqual('23:12')
    })

    it('returns the same if no seconds data', () => {
      const time = '23:12'

      expect(DateTimeFormats.stripTime(time)).toEqual('23:12')
    })

    const invalidTimes = ['23:12;00', '23:12trr', 'someText', 'some:text', 'tr:12:13', 'tr:12:']

    it.each(invalidTimes)('raises an error if the time is not in the right format', time => {
      expect(() => DateTimeFormats.stripTime(time)).toThrow(new InvalidDateStringError(`Invalid time: ${time}`))
    })
  })

  describe('isValidTime', () => {
    it.each([
      ['234:00', false],
      ['34456', false],
      ['1:', false],
      ['1', false],
      [':4', false],
      [23, false],
      [null, false],
      ['', false],
      ['-', false],
      ['01:0l', false],
      ['17:00', true],
      ['17:00:45', true],
    ])('returns false if not valid 24 hour time', (time: string, expected: boolean) => {
      expect(DateTimeFormats.isValidTime(time)).toEqual(expected)
    })

    describe('isBeforeTime', () => {
      it.each([
        ['11:00', '11:01'],
        ['12:30', '13:00'],
        ['00:01', '23:59'],
        ['09:00', '09:30'],
        ['10:10', '11:00'],
        ['10:10:00', '11:00:00'],
        ['10:10:01', '11:00:01'],
      ])('returns true if time is after time to compare', (time: string, timeToCompare: string) => {
        expect(DateTimeFormats.isBeforeTime(time, timeToCompare)).toBe(true)
      })

      it.each([
        ['11:01', '11:00'],
        ['13:00', '12:30'],
        ['23:59', '00:01'],
        ['09:30', '09:00'],
        ['11:00', '10:10'],
        ['11:00:00', '10:10:00'],
        ['11:00:01', '10:10:01'],
      ])('returns false if time is before time to compare', (time: string, timeToCompare: string) => {
        expect(DateTimeFormats.isBeforeTime(time, timeToCompare)).toBe(false)
      })

      it('returns false if time is same as time to compare', () => {
        expect(DateTimeFormats.isBeforeTime('11:00', '11:00')).toBe(false)
      })
    })
  })
})
