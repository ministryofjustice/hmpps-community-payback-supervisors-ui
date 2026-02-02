import { AppointmentDto, UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import { AppointmentCompletedAction, AppointmentOutcomeForm } from '../../../@types/user-defined'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import ReferenceDataService from '../../../services/referenceDataService'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import appointmentOutcomeFormFactory from '../../../testutils/factories/appointmentOutcomeFormFactory'
import DateTimeFormats from '../../../utils/dateTimeUtils'
import EndTimePage from './endTimePage'

jest.mock('../../../models/offender')

describe('EndTimePage', () => {
  const formId = '1'
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('viewData', () => {
    let form: AppointmentOutcomeForm
    const action = 'completed'
    const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>

    beforeEach(() => {
      form = appointmentOutcomeFormFactory.build()
    })

    it('should return an object back path, update path and endTime', () => {
      const appointmentId = '1'
      const endTime = '09:00'
      const projectCode = 'XR3'
      const appointment = appointmentFactory.build({ id: 1, endTime, projectCode })
      const offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }

      offenderMock.mockImplementation(() => {
        return offender
      })

      const page = new EndTimePage(action, formId)
      const result = page.viewData(appointment, form)
      expect(result).toEqual({
        offender,
        backPath: paths.appointments.show({ appointmentId, projectCode }),
        updatePath: `${paths.appointments.completed.endTime({ appointmentId, projectCode })}?form=${formId}`,
        time: form.endTime,
        question: `You're logging Sam Smith as finishing today at:`,
        documentTitle: 'Log finish time',
      })
    })

    it.each(['', '10:00'])('end time is form value if query has body', (updatedEndTime: string) => {
      const endTime = '09:00'
      const appointment = appointmentFactory.build({ id: 1, endTime })

      const page = new EndTimePage(action, formId, { time: updatedEndTime })
      const result = page.viewData(appointment, form)
      expect(result.time).toEqual(updatedEndTime)
    })

    it('returns leftEarly update path if action is leftEarly', () => {
      const appointment = appointmentFactory.build()
      const page = new EndTimePage('leftEarly', formId)
      const result = page.viewData(appointment, form)
      expect(result.updatePath).toBe(
        `${paths.appointments.leftEarly.endTime({
          projectCode: appointment.projectCode,
          appointmentId: appointment.id.toString(),
        })}?form=${formId}`,
      )
    })

    it('returns the left early title if action is leftEarly', () => {
      const offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }

      offenderMock.mockImplementation(() => {
        return offender
      })

      const appointment = appointmentFactory.build()
      const page = new EndTimePage('leftEarly', formId)
      const result = page.viewData(appointment, form)
      expect(result.question).toBe("You're logging out Sam Smith early today at:")
    })
  })

  describe('next', () => {
    describe('completed', () => {
      it('should be completed compliance path with project code and appointment Id', () => {
        const appointmentId = '1'
        const projectCode = '2'
        const page = new EndTimePage('completed', formId)
        const result = page.nextPath(appointmentId, projectCode)

        expect(result).toEqual(
          `${paths.appointments.completed.compliance({
            projectCode,
            appointmentId,
            contactOutcomeCode: ReferenceDataService.attendedCompliedOutcomeCode,
          })}?form=${formId}`,
        )
      })
    })

    describe('leftEarly', () => {
      it('should be left early reason path with project code and appointment Id', () => {
        const appointmentId = '1'
        const projectCode = '2'
        const page = new EndTimePage('leftEarly', formId)
        const result = page.nextPath(appointmentId, projectCode)

        expect(result).toEqual(`${paths.appointments.leftEarly.reason({ projectCode, appointmentId })}?form=${formId}`)
      })
    })
  })

  describe('validate', () => {
    const action = 'completed'
    let appointment: AppointmentDto

    beforeEach(() => {
      appointment = appointmentFactory.build({ startTime: '09:00' })
    })
    describe('when endTime is not present', () => {
      it.each([null, undefined, ''])('has errors should be true', (time?: string) => {
        const page = new EndTimePage(action, formId, { time })
        page.validate(appointment)

        expect(page.hasErrors).toEqual(true)
      })

      it.each([null, undefined, ''])('validation errors should include error', (time?: string) => {
        const page = new EndTimePage(action, formId, { time })
        page.validate(appointment)

        expect(page.validationErrors.time).toEqual({
          text: 'Enter the time they left',
        })
      })
    })

    describe('when endTime is not valid', () => {
      it('has errors should be true', () => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(false)
        const page = new EndTimePage(action, formId, { time: '8475438' })
        page.validate(appointment)

        expect(page.hasErrors).toEqual(true)
      })

      it('validation errors should include error', () => {
        const page = new EndTimePage(action, formId, { time: '8475438' })
        page.validate(appointment)

        expect(page.validationErrors.time).toEqual({
          text: 'Enter a valid finish time, for example 17:00',
        })
      })
    })

    describe('when endTime is before start time', () => {
      let page: EndTimePage
      beforeEach(() => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(true)
        jest.spyOn(DateTimeFormats, 'isAfterTime').mockReturnValue(false)

        page = new EndTimePage(action, formId, { time: '08:00' })
      })
      it('hasErrors should be true', () => {
        page.validate(appointment)

        expect(page.hasErrors).toEqual(true)
      })

      it('validationErrors should contain error message', () => {
        page.validate(appointment)

        expect(page.validationErrors.time).toEqual({
          text: 'Finish time must be after 09:00',
        })
      })
    })

    describe('when endTime is equal to start time', () => {
      let page: EndTimePage
      beforeEach(() => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(true)
        jest.spyOn(DateTimeFormats, 'isAfterTime').mockReturnValue(false)

        page = new EndTimePage(action, formId, { time: '09:00' })
      })
      it('hasErrors should be true', () => {
        page.validate(appointment)

        expect(page.hasErrors).toEqual(true)
      })

      it('validationErrors should contain error message', () => {
        page.validate(appointment)

        expect(page.validationErrors.time).toEqual({
          text: 'Finish time must be after 09:00',
        })
      })
    })

    describe('when no errors', () => {
      beforeEach(() => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(true)
        jest.spyOn(DateTimeFormats, 'isAfterTime').mockReturnValue(true)
      })
      it('should return false', () => {
        const page = new EndTimePage(action, formId, { time: '10:00' })
        page.validate(appointment)

        expect(page.hasErrors).toEqual(false)
      })

      it('endTime error should be undefined', () => {
        const page = new EndTimePage(action, formId, { time: '10:00' })
        page.validate(appointment)

        expect(page.validationErrors.time).toEqual(undefined)
      })
    })
  })

  describe('requestBody', () => {
    it.each(['completed', 'leftEarly'])(
      'returns the original appointment object with updated endTime',
      (action: AppointmentCompletedAction) => {
        const appointment = appointmentFactory.build({
          endTime: '17:00',
          id: 1,
          version: '2',
          contactOutcomeCode: '3',
          supervisorOfficerCode: '123',
        })
        const page = new EndTimePage(action, formId, { time: '16:00' })

        const result = page.requestBody(appointment)

        expect(result.endTime).toEqual('16:00')
      },
    )

    it.each(['completed', 'leftEarly'])(
      'returns the original appointment object with deliusId and deliusVersionToUpdate',
      (action: AppointmentCompletedAction) => {
        const appointment = appointmentFactory.build({
          endTime: '14:00',
          id: 1,
          version: '2',
          contactOutcomeCode: '3',
          supervisorOfficerCode: '123',
        })
        const page = new EndTimePage(action, formId, { time: '14:00' })

        const result = page.requestBody(appointment)

        const expected: UpdateAppointmentOutcomeDto = {
          contactOutcomeCode: '3',
          deliusVersionToUpdate: '2',
          deliusId: 1,
          supervisorOfficerCode: '123',
          endTime: '14:00',

          alertActive: appointment.alertActive,
          sensitive: appointment.sensitive,
          startTime: appointment.startTime,
          attendanceData: appointment.attendanceData,
          enforcementData: appointment.enforcementData,
          notes: null,
        }

        expect(result).toEqual(expected)
      },
    )
  })
})
