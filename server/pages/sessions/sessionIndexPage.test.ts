import MojDateInput from '../../forms/mojDateInput'
import SessionIndexPage from './sessionIndexPage'
import { SessionIndexPageInput } from '../../@types/user-defined'

describe('SessionIndexPage', () => {
  describe('validationErrors', () => {
    it('returns errors when fields are empty', () => {
      const page = new SessionIndexPage({} as SessionIndexPageInput)
      jest.spyOn(MojDateInput, 'validate').mockReturnValue(undefined)

      expect(page.validationErrors()).toEqual({
        team: { text: 'Choose a team' },
        provider: { text: 'Choose a region' },
      })
    })

    it('returns date error', () => {
      const dateError = { text: 'Date error' }
      jest.spyOn(MojDateInput, 'validate').mockReturnValue(dateError)
      const page = new SessionIndexPage({
        date: '11/13/2025',
        provider: 'x',
        team: 'y',
      } as SessionIndexPageInput)

      expect(page.validationErrors()).toEqual({
        date: dateError,
      })
    })
  })

  describe('items', () => {
    it('returns date value for template', () => {
      const page = new SessionIndexPage({
        date: '11/03/2025',
      } as SessionIndexPageInput)

      expect(page.items()).toEqual({
        date: '11/03/2025',
      })
    })
  })

  describe('searchValues', () => {
    it('returns query items formatted for API request with same date for startDate and endDate', () => {
      const page = new SessionIndexPage({
        team: 'XR123',
        date: '7/7/2024',
      })

      const result = page.searchValues()

      expect(result).toEqual({
        startDate: '2024-07-07',
        projectTypeCode: undefined,
        endDate: '2024-07-07',
        teamCode: 'XR123',
      })
    })
  })
})
