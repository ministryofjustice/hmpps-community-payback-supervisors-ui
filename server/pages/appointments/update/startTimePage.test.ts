import { AppointmentDto, UpdateAppointmentOutcomeDto } from '../../../@types/shared'
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
        time: startTime,
        question: `You're logging Sam Smith as having arrived at:`,
        documentTitle: 'Log start time',
        deliusVersion: appointment.version,
      })
    })

    it.each(['', '10:00'])('start time is form value if query has body', (updatedStartTime: string) => {
      const startTime = '09:00'
      const appointment = appointmentFactory.build({ id: 1, startTime })

      const page = new StartTimePage(action, { time: updatedStartTime })
      const result = page.viewData(appointment)
      expect(result.time).toEqual(updatedStartTime)
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

    it('returns the absent title if action is absent', () => {
      const offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }

      offenderMock.mockImplementation(() => {
        return offender
      })

      const appointment = appointmentFactory.build()
      const page = new StartTimePage('absent')
      const result = page.viewData(appointment)
      expect(result.question).toBe("You're logging Sam Smith as absent today at:")
    })
  })

  describe('next', () => {
    describe('arrived', () => {
      it('should be able to work path with project code and appointment Id', () => {
        const appointmentId = '1'
        const projectCode = '2'
        const page = new StartTimePage('arrived')
        const result = page.nextPath(appointmentId, projectCode)

        expect(result).toEqual(paths.appointments.arrived.isAbleToWork({ projectCode, appointmentId }))
      })
    })

    describe('absent', () => {
      it('should be confirm path with project code and appointment Id', () => {
        const appointmentId = '1'
        const projectCode = '2'
        const page = new StartTimePage('absent')
        const result = page.nextPath(appointmentId, projectCode)

        expect(result).toEqual(paths.appointments.confirm.absent({ projectCode, appointmentId }))
      })
    })
  })

  describe('validate', () => {
    let appointment: AppointmentDto
    const action = 'arrived'

    beforeEach(() => {
      appointment = appointmentFactory.build({ endTime: '17:00' })
    })

    describe('when startTime is not present', () => {
      it.each([null, undefined, ''])('should return true', (time?: string) => {
        const page = new StartTimePage(action, { time })
        page.validate(appointment)

        expect(page.hasErrors).toEqual(true)
      })

      it.each([null, undefined, ''])('should return true', (time?: string) => {
        const page = new StartTimePage(action, { time })
        page.validate(appointment)

        expect(page.validationErrors.time).toEqual({
          text: 'Enter a start time',
        })
      })
    })

    describe('when startTime is not valid', () => {
      it('should return true', () => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(false)
        const page = new StartTimePage(action, { time: '8475438' })
        page.validate(appointment)

        expect(page.hasErrors).toEqual(true)
      })

      it('should return the correct error', () => {
        const page = new StartTimePage(action, { time: '8475438' })
        page.validate(appointment)

        expect(page.validationErrors.time).toEqual({
          text: 'Enter a valid start time, for example 09:00',
        })
      })
    })

    describe('when time is before start time', () => {
      let page: StartTimePage
      beforeEach(() => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(true)
        jest.spyOn(DateTimeFormats, 'isAfterTime').mockReturnValue(true)
        page = new StartTimePage(action, { time: '17:00' })
      })
      it('hasErrors should be true', () => {
        jest.spyOn(DateTimeFormats, 'isAfterTime').mockReturnValue(true)
        page.validate(appointment)

        expect(page.hasErrors).toEqual(true)
      })

      it('validationErrors should contain error message', () => {
        page.validate(appointment)

        expect(page.validationErrors.time).toEqual({
          text: 'Start time must be before 17:00 when they are expected to finish the session',
        })
      })
    })

    describe('when the delius versions do not match', () => {
      it('validationErrors should contain error message', () => {
        const oldDeliusVersion = '1'
        const newDeliusVersion = '2'

        const appointmentWithUpdatedVersion = appointmentFactory.build({ version: newDeliusVersion })

        const page = new StartTimePage(action, { time: '09:00', deliusVersion: oldDeliusVersion })

        page.validate(appointmentWithUpdatedVersion)

        expect(page.hasErrors).toEqual(true)
        expect(page.validationErrors.time).toEqual({
          text: 'The arrival time has already been updated in the database, try again',
        })
      })
    })

    describe('when no errors', () => {
      it('should return false', () => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(true)
        jest.spyOn(DateTimeFormats, 'isAfterTime').mockReturnValue(false)
        const page = new StartTimePage(action, { time: '09:00' })
        page.validate(appointment)

        expect(page.hasErrors).toEqual(false)
      })

      it('startTime error should be undefined', () => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(true)
        jest.spyOn(DateTimeFormats, 'isAfterTime').mockReturnValue(false)
        const page = new StartTimePage(action, { time: '09:00' })
        page.validate(appointment)

        expect(page.validationErrors.time).toEqual(undefined)
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
        const page = new StartTimePage(action, { time: '10:00' })

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
        const page = new StartTimePage(action, { time: '09:00' })

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
          notes: null,
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
        const page = new StartTimePage(action, { time: '10:00' })

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
        const page = new StartTimePage(action, { time: '09:00' })

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
          notes: null,
        }

        expect(result).toEqual(expected)
      })
    })
  })
})
