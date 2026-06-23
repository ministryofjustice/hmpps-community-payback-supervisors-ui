import Offender from '../../models/offender'
import paths from '../../paths'
import appointmentFactory from '../../testutils/factories/appointmentFactory'
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
      const appointment = appointmentFactory.build({ startTime, endTime, contactOutcomeCode: null })
      const offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }

      offenderMock.mockImplementation(() => {
        return offender
      })

      const statusTagHtml = 'Scheduled'

      const page = new AppointmentShowDetailsPage()
      const result = page.viewData(appointment, null)
      const { projectCode, date, id } = appointment
      expect(result).toEqual({
        offender,
        startTime: '09:00',
        endTime: '17:00',
        backPath: paths.sessions.show({ projectCode, date }),
        actions: [
          {
            text: 'Arrived',
            href: paths.appointments.attendanceOutcome({ projectCode, appointmentId: id.toString() }),
          },
          {
            text: 'Not arrived',
            href: paths.appointments.notes.absent({ projectCode, appointmentId: id.toString() }),
          },
        ],
        statusTagHtml,
        canBeUpdated: true,
      })
    })

    describe('actions', () => {
      it.each(['Scheduled', 'Not expected'])('should include arrived links if status is "%s"', () => {
        const appointment = appointmentFactory.build({ contactOutcomeCode: null })
        const page = new AppointmentShowDetailsPage()
        const result = page.viewData(appointment, null)
        const { projectCode, id } = appointment

        expect(result.actions).toEqual([
          {
            text: 'Arrived',
            href: paths.appointments.attendanceOutcome({ projectCode, appointmentId: id.toString() }),
          },
          {
            text: 'Not arrived',
            href: paths.appointments.notes.absent({ projectCode, appointmentId: id.toString() }),
          },
        ])
      })
    })

    describe('canBeUpdated', () => {
      it('returns true if the appointment date is in the past', () => {
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const appointment = appointmentFactory.build({ date: yesterday.toISOString() })
        const page = new AppointmentShowDetailsPage()
        const result = page.viewData(appointment, null)

        expect(result.canBeUpdated).toBe(true)
      })

      it('returns true if the appointment start time is in the past', () => {
        const now = new Date()
        const tenMinutesAgo = new Date(now)
        tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10)

        const startTime = `${tenMinutesAgo.getHours().toString().padStart(2, '0')}:${tenMinutesAgo.getMinutes().toString().padStart(2, '0')}`

        const appointment = appointmentFactory.build({ date: new Date().toISOString(), startTime })
        const page = new AppointmentShowDetailsPage()
        const result = page.viewData(appointment, null)

        expect(result.canBeUpdated).toBe(true)
      })

      it('returns false if the appointment date is not in the past', () => {
        const now = new Date()
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const appointment = appointmentFactory.build({ date: tomorrow.toISOString() })
        const page = new AppointmentShowDetailsPage()
        const result = page.viewData(appointment, null)

        expect(result.canBeUpdated).toBe(false)
      })

      it('returns false if the appointment start time is not in the past', () => {
        const now = new Date()
        const tenMinutesFromNow = new Date(now)
        tenMinutesFromNow.setMinutes(now.getMinutes() + 10)

        const startTime = `${tenMinutesFromNow.getHours().toString().padStart(2, '0')}:${tenMinutesFromNow.getMinutes().toString().padStart(2, '0')}`

        const appointment = appointmentFactory.build({ date: new Date().toISOString(), startTime })
        const page = new AppointmentShowDetailsPage()
        const result = page.viewData(appointment, null)

        expect(result.canBeUpdated).toBe(false)
      })
    })
  })
})
