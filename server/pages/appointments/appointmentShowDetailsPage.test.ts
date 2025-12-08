import { AppointmentStatusType } from '../../@types/user-defined'
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
        actions: [
          {
            text: 'Arrived',
            href: paths.appointments.arrived.startTime({ projectCode, appointmentId: id.toString() }),
          },
          {
            text: 'Not arrived',
            href: paths.appointments.absent.startTime({ projectCode, appointmentId: id.toString() }),
          },
        ],
        statusTagHtml,
      })
    })

    describe('actions', () => {
      it.each(['Scheduled', 'Not expected'])(
        'should include arrived links if status is "%s"',
        (status: AppointmentStatusType) => {
          const appointment = appointmentFactory.build()
          const page = new AppointmentShowDetailsPage()
          const result = page.viewData(appointment, status)
          const { projectCode, id } = appointment

          expect(result.actions).toEqual([
            {
              text: 'Arrived',
              href: paths.appointments.arrived.startTime({ projectCode, appointmentId: id.toString() }),
            },
            {
              text: 'Not arrived',
              href: paths.appointments.absent.startTime({ projectCode, appointmentId: id.toString() }),
            },
          ])
        },
      )

      it('should include finish session links if status is "Working"', () => {
        const appointment = appointmentFactory.build()
        const page = new AppointmentShowDetailsPage()
        const result = page.viewData(appointment, 'Working')

        expect(result.actions).toEqual([
          {
            text: 'Finish session',
            href: paths.appointments.completed.endTime({
              appointmentId: appointment.id.toString(),
              projectCode: appointment.projectCode,
            }),
          },
        ])
      })

      it.each(['Completed', 'Absent'])('should be empty if status is "%s"', (status: AppointmentStatusType) => {
        const appointment = appointmentFactory.build()
        const page = new AppointmentShowDetailsPage()
        const result = page.viewData(appointment, status)

        expect(result.actions).toEqual([])
      })
    })
  })
})
