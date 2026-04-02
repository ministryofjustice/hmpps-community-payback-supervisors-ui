import { UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import ReferenceDataService from '../../../services/referenceDataService'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import { contactOutcomesFactory } from '../../../testutils/factories/contactOutcomeFactory'
import UnableToWorkPage from './unableToWorkPage'

jest.mock('../../../models/offender')

describe('UnableToWorkPage', () => {
  const formId = 'test-form-id'
  const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('viewData', () => {
    it('should return an object with correct data', () => {
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

      const { contactOutcomes } = contactOutcomesFactory.build()

      const page = new UnableToWorkPage(formId)
      const result = page.viewData(appointment, contactOutcomes)
      expect(result).toEqual({
        notes: undefined,
        isSensitive: undefined,
        offender,
        backPath: `${paths.appointments.arrived.endTime({ appointmentId, projectCode })}?form=${formId}`,
        updatePath: `${paths.appointments.arrived.unableToWork({ appointmentId, projectCode })}?form=${formId}`,
        title: `Why is Sam Smith unable to work today?`,
        items: [
          {
            text: contactOutcomes[0].name,
            value: contactOutcomes[0].code,
            checked: false,
          },
          {
            text: contactOutcomes[1].name,
            value: contactOutcomes[1].code,
            checked: false,
          },
          {
            text: contactOutcomes[2].name,
            value: contactOutcomes[2].code,
            checked: false,
          },
        ],
      })
    })
  })

  describe('next', () => {
    it('should return path to the confirm unable to work page with project code and appointment Id', () => {
      const appointmentId = '1'
      const projectCode = '2'
      const page = new UnableToWorkPage(formId)
      const result = page.nextPath(appointmentId, projectCode)

      expect(result).toEqual(paths.appointments.confirm.unableToWork({ projectCode, appointmentId }))
    })
  })

  describe('validate', () => {
    describe('when unableToWork is not present', () => {
      it('should return true for page.hasError', () => {
        const page = new UnableToWorkPage(formId, {})
        page.validate()

        expect(page.hasErrors).toEqual(true)
      })

      it('should return the correct error', () => {
        const page = new UnableToWorkPage(formId, {})
        page.validate()

        expect(page.validationErrors.unableToWork).toEqual({
          text: 'Select the reason why the person is unable to work today',
        })
      })
    })
  })

  describe('requestBody', () => {
    it('returns the original appointment object with updated contactOutcomeCode', () => {
      const appointment = appointmentFactory.build({
        startTime: '09:00',
        id: 1,
        version: '2',
        contactOutcomeCode: 'AAAA',
        supervisorOfficerCode: '123',
      })
      const page = new UnableToWorkPage(formId, { unableToWork: 'BBBB' })

      const result = page.requestBody(appointment)

      expect(result.contactOutcomeCode).toEqual('BBBB')
    })

    it('returns the endTime from formData when provided', () => {
      const appointment = appointmentFactory.build({
        endTime: '17:00',
      })

      const formData = { deliusVersion: '1', startTime: '09:00', endTime: '15:30' }

      const page = new UnableToWorkPage(formId, { unableToWork: 'BBBB' })

      const result = page.requestBody(appointment, formData)

      expect(result.endTime).toEqual(formData.endTime)
    })

    it('returns the appointment endTime when formData is not provided', () => {
      const appointment = appointmentFactory.build({
        endTime: '17:00',
      })
      const page = new UnableToWorkPage(formId, { unableToWork: 'BBBB' })

      const result = page.requestBody(appointment)

      expect(result.endTime).toEqual('17:00')
    })

    it('returns the startTime from formData when provided', () => {
      const appointment = appointmentFactory.build({
        startTime: '09:00',
      })

      const formData = { deliusVersion: '1', startTime: '08:30', endTime: '17:00' }
      const page = new UnableToWorkPage(formId, { unableToWork: 'BBBB' })

      const result = page.requestBody(appointment, formData)

      expect(result.startTime).toEqual(formData.startTime)
    })

    it('returns the appointment startTime when formData is not provided', () => {
      const appointment = appointmentFactory.build({
        startTime: '09:00',
      })
      const page = new UnableToWorkPage(formId, { unableToWork: 'BBBB' })

      const result = page.requestBody(appointment)

      expect(result.startTime).toEqual('09:00')
    })

    describe('notes', () => {
      it('returns the original appointment object with updated notes', () => {
        const appointment = appointmentFactory.build({
          notes: 'xxxxx',
          id: 1,
          version: '2',
          contactOutcomeCode: 'AAAA',
        })
        const page = new UnableToWorkPage(formId, { unableToWork: 'BBBB', notes: 'yyyyy' })

        const result = page.requestBody(appointment)

        expect(result.notes).toEqual('yyyyy')
      })

      it('returns null for notes if not included in the query', () => {
        const appointment = appointmentFactory.build({
          notes: 'xxxxx',
          id: 1,
          version: '2',
          contactOutcomeCode: 'AAAA',
        })
        const page = new UnableToWorkPage(formId, { unableToWork: 'BBBB' })

        const result = page.requestBody(appointment)

        expect(result.notes).toBeNull()
      })
    })

    describe('sensitive', () => {
      it('returns true if isSensitive is checked', () => {
        const appointment = appointmentFactory.build({
          sensitive: false,
        })
        const page = new UnableToWorkPage(formId, { unableToWork: 'BBBB', isSensitive: 'isSensitive' })

        const result = page.requestBody(appointment)

        expect(result.sensitive).toEqual(true)
      })

      it('returns unchanged (true) if isSensitive is not checked', () => {
        const appointment = appointmentFactory.build({
          sensitive: true,
        })
        const page = new UnableToWorkPage(formId, { unableToWork: 'BBBB' })

        const result = page.requestBody(appointment)

        expect(result.sensitive).toBe(true)
      })

      it('returns unchanged (false) if isSensitive is not checked', () => {
        const appointment = appointmentFactory.build({
          sensitive: false,
        })
        const page = new UnableToWorkPage(formId, { unableToWork: 'BBBB' })

        const result = page.requestBody(appointment)

        expect(result.sensitive).toBe(false)
      })

      it('returns unchanged (undefined) if isSensitive is not checked', () => {
        const appointment = appointmentFactory.build({
          sensitive: undefined,
        })
        const page = new UnableToWorkPage(formId, { unableToWork: 'BBBB' })

        const result = page.requestBody(appointment)

        expect(result.sensitive).toBeUndefined()
      })
    })

    describe('attendanceData', () => {
      describe('when the contact outcome is "Attended - Sent home (behaviour)"', () => {
        it('sets the correct attendance data', () => {
          const appointment = appointmentFactory.build()

          const page = new UnableToWorkPage(formId, {
            unableToWork: ReferenceDataService.attendedSentHomeBehaviourOutcomeCode,
          })

          const result = page.requestBody(appointment)

          expect(result.attendanceData).toEqual(
            expect.objectContaining({
              hiVisWorn: false,
              workedIntensively: false,
              workQuality: 'NOT_APPLICABLE',
              behaviour: 'UNSATISFACTORY',
            }),
          )
        })
      })

      describe('when the contact outcome is "Attended - Sent home (service issues)"', () => {
        it('sets the correct attendance data', () => {
          const appointment = appointmentFactory.build()

          const page = new UnableToWorkPage(formId, {
            unableToWork: ReferenceDataService.attendedSentHomeServiceIssuesOutcomeCode,
          })

          const result = page.requestBody(appointment)

          expect(result.attendanceData).toEqual(
            expect.objectContaining({
              hiVisWorn: false,
              workedIntensively: false,
              workQuality: 'NOT_APPLICABLE',
              behaviour: 'NOT_APPLICABLE',
            }),
          )
        })
      })

      describe('when the contact outcome is "Attended - Failed to comply"', () => {
        it('sets the correct attendance data', () => {
          const appointment = appointmentFactory.build()

          const page = new UnableToWorkPage(formId, {
            unableToWork: ReferenceDataService.attendedFailedToComplyOutcomeCode,
          })

          const result = page.requestBody(appointment)

          expect(result.attendanceData).toEqual(
            expect.objectContaining({
              hiVisWorn: false,
              workedIntensively: false,
              workQuality: 'NOT_APPLICABLE',
              behaviour: 'NOT_APPLICABLE',
            }),
          )
        })
      })
    })

    it('returns the original appointment object with deliusId and deliusVersionToUpdate', () => {
      const appointment = appointmentFactory.build({
        startTime: '09:00',
        id: 1,
        version: '2',
        contactOutcomeCode: 'AAAA',
        supervisorOfficerCode: '123',
        sensitive: true,
      })
      const page = new UnableToWorkPage(formId, { unableToWork: 'BBBB' })

      const result = page.requestBody(appointment)

      const expected: UpdateAppointmentOutcomeDto = {
        contactOutcomeCode: 'BBBB',
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
