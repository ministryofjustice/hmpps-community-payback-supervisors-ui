import { AppointmentDto } from '../../../@types/shared'
import { AppointmentArrivedAction, AppointmentOutcomeForm } from '../../../@types/user-defined'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import appointmentOutcomeFormFactory from '../../../testutils/factories/appointmentOutcomeFormFactory'
import DateTimeFormats from '../../../utils/dateTimeUtils'
import StartTimePage from './startTimePage'

jest.mock('../../../models/offender')

describe('StartTimePage', () => {
  const formId = '1'
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('viewData', () => {
    let form: AppointmentOutcomeForm
    const action = 'arrived'
    const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>

    beforeEach(() => {
      form = appointmentOutcomeFormFactory.build()
    })

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

      const page = new StartTimePage(action, formId)
      const result = page.viewData(appointment, form)
      expect(result).toEqual({
        offender,
        backPath: paths.appointments.show({ appointmentId, projectCode }),
        updatePath: `${paths.appointments.arrived.startTime({ appointmentId, projectCode })}?form=${formId}`,
        time: form.startTime,
        question: `You're logging Sam Smith as having arrived at:`,
        documentTitle: 'Log start time',
      })
    })

    it.each(['', '10:00'])('start time is form value if query has body', (updatedStartTime: string) => {
      const startTime = '09:00'
      const appointment = appointmentFactory.build({ id: 1, startTime })

      const page = new StartTimePage(action, formId, { time: updatedStartTime })
      const result = page.viewData(appointment, form)
      expect(result.time).toEqual(updatedStartTime)
    })

    it('returns absent update path if action is absent', () => {
      const appointment = appointmentFactory.build()
      const page = new StartTimePage('absent', formId)
      const result = page.viewData(appointment, form)
      expect(result.updatePath).toBe(
        `${paths.appointments.absent.startTime({
          projectCode: appointment.projectCode,
          appointmentId: appointment.id.toString(),
        })}?form=${formId}`,
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
      const page = new StartTimePage('absent', formId)
      const result = page.viewData(appointment, form)
      expect(result.question).toBe("You're logging Sam Smith as absent today at:")
    })
  })

  describe('next', () => {
    describe('arrived', () => {
      it('should be able to work path with project code and appointment Id', () => {
        const appointmentId = '1'
        const projectCode = '2'
        const page = new StartTimePage('arrived', formId)
        const result = page.nextPath(appointmentId, projectCode)

        expect(result).toEqual(
          `${paths.appointments.arrived.isAbleToWork({ projectCode, appointmentId })}?form=${formId}`,
        )
      })
    })

    describe('absent', () => {
      it('should be confirm path with project code and appointment Id', () => {
        const appointmentId = '1'
        const projectCode = '2'
        const page = new StartTimePage('absent', formId)
        const result = page.nextPath(appointmentId, projectCode)

        expect(result).toEqual(`${paths.appointments.confirm.absent({ projectCode, appointmentId })}?form=${formId}`)
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
        const page = new StartTimePage(action, formId, { time })
        page.validate(appointment)

        expect(page.hasErrors).toEqual(true)
      })

      it.each([null, undefined, ''])('should return true', (time?: string) => {
        const page = new StartTimePage(action, formId, { time })
        page.validate(appointment)

        expect(page.validationErrors.time).toEqual({
          text: 'Enter a start time',
        })
      })
    })

    describe('when startTime is not valid', () => {
      it('should return true', () => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(false)
        const page = new StartTimePage(action, formId, { time: '8475438' })
        page.validate(appointment)

        expect(page.hasErrors).toEqual(true)
      })

      it('should return the correct error', () => {
        const page = new StartTimePage(action, formId, { time: '8475438' })
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
        page = new StartTimePage(action, formId, { time: '17:00' })
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

    describe('when no errors', () => {
      it('should return false', () => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(true)
        jest.spyOn(DateTimeFormats, 'isAfterTime').mockReturnValue(false)
        const page = new StartTimePage(action, formId, { time: '09:00' })
        page.validate(appointment)

        expect(page.hasErrors).toEqual(false)
      })

      it('startTime error should be undefined', () => {
        jest.spyOn(DateTimeFormats, 'isValidTime').mockReturnValue(true)
        jest.spyOn(DateTimeFormats, 'isAfterTime').mockReturnValue(false)
        const page = new StartTimePage(action, formId, { time: '09:00' })
        page.validate(appointment)

        expect(page.validationErrors.time).toEqual(undefined)
      })
    })
  })

  describe('updatedFormData', () => {
    describe('arrived', () => {
      const action: AppointmentArrivedAction = 'arrived'
      it('returns form data with updated startTime', () => {
        const form = appointmentOutcomeFormFactory.build()
        const page = new StartTimePage(action, formId, { time: '10:00' })

        const result = page.updatedFormData(form)

        expect(result).toEqual({ ...form, startTime: '10:00' })
      })
    })

    describe('absent', () => {
      const action: AppointmentArrivedAction = 'absent'
      it('returns form data with updated startTime and contact outcome code', () => {
        const form = appointmentOutcomeFormFactory.build()
        const page = new StartTimePage(action, formId, { time: '10:00' })

        const result = page.updatedFormData(form)

        expect(result).toEqual({
          ...form,
          startTime: '10:00',
          contactOutcomeCode: StartTimePage.UnacceptableAbsenceOutcomeCode,
        })
      })
    })
  })
})
