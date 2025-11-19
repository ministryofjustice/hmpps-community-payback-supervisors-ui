import { UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import DateTimeFormats from '../../../utils/dateTimeUtils'
import StartTimePage from './startTimePage'

jest.mock('../../../models/offender')

describe('StartTimePage', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('viewData', () => {
    const action = 'arrived'
    const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>

    it('should return an object back path, update path and startTime', () => {
      const appointmentId = '1'
      const startTime = '09:00'
      const projectCode = 'XR3'
      const appointment = appointmentFactory.build({ id: 1, startTime, projectCode })
      const offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }

      offenderMock.mockImplementation(() => {
        return offender
      })

      const page = new StartTimePage(action)
      const result = page.viewData(appointment)
      expect(result).toEqual({
        offender,
        backPath: paths.appointments.show({ appointmentId, projectCode }),
        updatePath: paths.appointments.arrived.startTime({ appointmentId, projectCode }),
        startTime,
        title: `You are logging Sam Smith as having arrived at:`,
      })
    })

    it.each(['', '10:00'])('start time is form value if query has body', (updatedStartTime: string) => {
      const startTime = '09:00'
      const appointment = appointmentFactory.build({ id: 1, startTime })

      const page = new StartTimePage(action, { startTime: updatedStartTime })
      const result = page.viewData(appointment)
      expect(result.startTime).toEqual(updatedStartTime)
    })

    it('returns absent update path if action is absent', () => {
      const appointment = appointmentFactory.build()
      const page = new StartTimePage('absent')
      const result = page.viewData(appointment)
      expect(result.updatePath).toBe(
        paths.appointments.absent.startTime({
          projectCode: appointment.projectCode,
          appointmentId: appointment.id.toString(),
        }),
      )
    })
  })

  describe('next', () => {
    describe('arrived', () => {
      it('should be able to work path with project code and appointment Id', () => {
        const appointmentId = '1'
        const projectCode = '2'
        const page = new StartTimePage('arrived')
        const result = page.nextPath(appointmentId, projectCode)

        expect(result).toEqual(paths.appointments.arrived.ableToWork({ projectCode, appointmentId }))
      })
    })

    describe('absent', () => {
      it('should be confirm path with project code and appointment Id', () => {
        const appointmentId = '1'
        const projectCode = '2'
        const page = new StartTimePage('absent')
        const result = page.nextPath(appointmentId, projectCode)

        expect(result).toEqual(paths.appointments.absent.startTime({ projectCode, appointmentId }))
      })
    })
  })

  describe('validate', () => {
    const action = 'arrived'
    describe('when startTime is not present', () => {
      it.each([null, undefined, ''])('should return true', (time?: string) => {
        const page = new StartTimePage(action, { startTime: time })
        page.validate()

        expect(page.hasErrors).toEqual(true)
      })

      it.each([null, undefined, ''])('should return true', (time?: string) => {
        const page = new StartTimePage(action, { startTime: time })
        page.validate()

        expect(page.validationErrors.startTime).toEqual({
          text: 'Enter a start time',
        })
      })
    })

    describe('when startTime is not valid', () => {
      it('should return true', () => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(false)
        const page = new StartTimePage(action, { startTime: '8475438' })
        page.validate()

        expect(page.hasErrors).toEqual(true)
      })

      it('should return the correct error', () => {
        const page = new StartTimePage(action, { startTime: '8475438' })
        page.validate()

        expect(page.validationErrors.startTime).toEqual({
          text: 'Enter a valid start time, for example 09:00',
        })
      })
    })

    describe('when startTime is valid', () => {
      it('should return false', () => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(true)
        const page = new StartTimePage(action, { startTime: '09:00' })
        page.validate()

        expect(page.hasErrors).toEqual(false)
      })

      it('startTime error should be undefined', () => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(true)
        const page = new StartTimePage(action, { startTime: '09:00' })
        page.validate()

        expect(page.validationErrors.startTime).toEqual(undefined)
      })
    })
  })

  describe('requestBody', () => {
    describe('arrived', () => {
      const action = 'arrived'
      it('returns the original appointment object with updated startTime', () => {
        const appointment = appointmentFactory.build({
          startTime: '09:00',
          id: 1,
          version: '2',
          contactOutcomeCode: '3',
          supervisorOfficerCode: '123',
        })
        const page = new StartTimePage(action, { startTime: '10:00' })

        const result = page.requestBody(appointment)

        expect(result.startTime).toEqual('10:00')
      })

      it('returns the original appointment object with deliusId and deliusVersionToUpdate', () => {
        const appointment = appointmentFactory.build({
          startTime: '09:00',
          id: 1,
          version: '2',
          contactOutcomeCode: '3',
          supervisorOfficerCode: '123',
        })
        const page = new StartTimePage(action, { startTime: '09:00' })

        const result = page.requestBody(appointment)

        const expected: UpdateAppointmentOutcomeDto = {
          contactOutcomeCode: '3',
          deliusVersionToUpdate: '2',
          deliusId: 1,
          supervisorOfficerCode: '123',
          startTime: '09:00',

          alertActive: appointment.alertActive,
          sensitive: appointment.sensitive,
          endTime: appointment.endTime,
          attendanceData: appointment.attendanceData,
          enforcementData: appointment.enforcementData,
          notes: appointment.notes,
        }

        expect(result).toEqual(expected)
      })
    })

    describe('absent', () => {
      const action = 'absent'
      it('returns the original appointment object with updated startTime', () => {
        const appointment = appointmentFactory.build({
          startTime: '09:00',
          id: 1,
          version: '2',
          contactOutcomeCode: '3',
          supervisorOfficerCode: '123',
        })
        const page = new StartTimePage(action, { startTime: '10:00' })

        const result = page.requestBody(appointment)

        expect(result.startTime).toEqual('10:00')
      })

      it('returns the original appointment object with deliusId, deliusVersionToUpdate and updated contact outcome', () => {
        const appointment = appointmentFactory.build({
          startTime: '09:00',
          id: 1,
          version: '2',
          contactOutcomeCode: '3',
          supervisorOfficerCode: '123',
        })
        const page = new StartTimePage(action, { startTime: '09:00' })

        const result = page.requestBody(appointment)

        const expected: UpdateAppointmentOutcomeDto = {
          contactOutcomeCode: StartTimePage.UnacceptableAbsenceOutcomeCode,
          deliusVersionToUpdate: '2',
          deliusId: 1,
          supervisorOfficerCode: '123',
          startTime: '09:00',

          alertActive: appointment.alertActive,
          sensitive: appointment.sensitive,
          endTime: appointment.endTime,
          attendanceData: appointment.attendanceData,
          enforcementData: appointment.enforcementData,
          notes: appointment.notes,
        }

        expect(result).toEqual(expected)
      })
    })
  })
})
