import unpaidWorkDetailsFactory from '../testutils/factories/unpaidWorkDetailsFactory'
import UnpaidWorkUtils from './unpaidWorkUtils'

describe('UnpaidWorkUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('unpaidWorkHoursDetails', () => {
    it('returns formatted hours details with totalHoursRemaining', () => {
      const unpaidWorkDetail = unpaidWorkDetailsFactory.build({
        requiredMinutes: 180,
        completedMinutes: 100,
        completedEteMinutes: 60,
        remainingEteMinutes: 30,
        allowedEteMinutes: 90,
      })

      const result = UnpaidWorkUtils.unpaidWorkHoursDetails(unpaidWorkDetail)

      expect(result).toEqual({
        totalHoursOrdered: '3 hours',
        totalHoursCredited: '1 hour 40 minutes',
        totalHoursRemaining: '1 hour 20 minutes', // 180 - 100 = 80 minutes
      })
    })
  })
})
