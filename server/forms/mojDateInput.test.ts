import InvalidDateStringError from '../errors/invalidDateStringError'
import MojDateInput from './mojDateInput'

describe('MojDateInput', () => {
  describe('validate', () => {
    it('returns required message when blank', () => {
      const result = MojDateInput.validate('')

      expect(result).toEqual({ text: 'Enter or select a date' })
    })

    it('returns invalid message when value cannot be parsed as a date', () => {
      const result = MojDateInput.validate('31/6/2026')

      expect(result).toEqual({
        text: `Enter a real date in the correct format. For example, 17/5/2024`,
      })
    })

    it('returns undefined for a valid date', () => {
      const result = MojDateInput.validate('7/5/2026')

      expect(result).toBeUndefined()
    })

    it('supports a custom label', () => {
      const result = MojDateInput.validate('', 'Session date')

      expect(result).toEqual({ text: 'Enter or select a Session date' })
    })
  })

  describe('isValid', () => {
    it.each(['7/5/2026', '07/05/2026', '29/2/2024'])('returns true for valid input %s', value => {
      expect(MojDateInput.isValid(value)).toBe(true)
    })

    it.each(['', undefined, '2026-05-07', '7-5-2026', '7/5/26', '31/02/2026', '29/2/2025'])(
      'returns false for invalid input %s',
      value => {
        expect(MojDateInput.isValid(value)).toBe(false)
      },
    )
  })

  describe('toIsoDate', () => {
    it('converts dd/MM/yyyy input to ISO format', () => {
      const result = MojDateInput.toIsoDate('07/05/2026')

      expect(result).toEqual('2026-05-07')
    })

    it('converts d/M/yyyy input to ISO format', () => {
      const result = MojDateInput.toIsoDate('7/5/2026')

      expect(result).toEqual('2026-05-07')
    })

    it('throws for invalid values', () => {
      expect(() => MojDateInput.toIsoDate('31/02/2026')).toThrow(InvalidDateStringError)
    })
  })
})
