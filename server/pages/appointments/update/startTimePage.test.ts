import Offender from '../../../models/offender'
import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import StartTimePage from './startTimePage'

jest.mock('../../../models/offender')

describe('StartTimePage', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('viewData', () => {
    const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>

    it('should return an object back path, update path and startTime', () => {
      const appointmentId = '1'
      const startTime = '09:00'
      const appointment = appointmentFactory.build({ id: 1, startTime })
      const projectCode = 'XR3'
      const offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }

      offenderMock.mockImplementation(() => {
        return offender
      })

      const page = new StartTimePage()
      const result = page.viewData(appointment, projectCode)
      expect(result).toEqual({
        offender,
        backPath: paths.appointments.show({ appointmentId, projectCode }),
        updatePath: paths.appointments.startTime({ appointmentId, projectCode }),
        startTime,
        title: `You are logging Sam Smith as having arrived at:`,
      })
    })
  })

  describe('next', () => {
    it('should be able to work path with project code and appointment Id', () => {
      const appointmentId = '1'
      const projectCode = '2'
      const page = new StartTimePage()
      const result = page.nextPath(appointmentId, projectCode)

      expect(result).toEqual(paths.appointments.ableToWork({ projectCode, appointmentId }))
    })
  })
})
