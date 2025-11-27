import Offender from '../../models/offender'
import paths from '../../paths'
import appointmentFactory from '../../testutils/factories/appointmentFactory'
import StatusTagUtils from '../../utils/GovUKFrontend/statusTagUtils'
import AppointmentShowDetailsPage from './appointmentShowDetailsPage'

jest.mock('../../models/offender')

describe('AppointmentShowDetailsPage', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('viewData', () => {
    const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>

    it('should return an object with correct data', () => {
      const startTime = '09:00:00'
      const endTime = '17:00:00'
      const appointment = appointmentFactory.build({ startTime, endTime })
      const offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }

      offenderMock.mockImplementation(() => {
        return offender
      })

      const statusTagHtml = '<strong>Scheduled</strong>'
      jest.spyOn(StatusTagUtils, 'getHtml').mockReturnValue(statusTagHtml)

      const page = new AppointmentShowDetailsPage()
      const result = page.viewData(appointment, 'Scheduled')
      const { projectCode, date, id } = appointment
      expect(result).toEqual({
        offender,
        startTime: '09:00',
        endTime: '17:00',
        backPath: paths.sessions.show({ projectCode, date }),
        actions: {
          arrivedPath: paths.appointments.arrived.startTime({ projectCode, appointmentId: id.toString() }),
          absentPath: paths.appointments.absent.startTime({ projectCode, appointmentId: id.toString() }),
        },
        statusTagHtml,
      })
    })
  })
})
