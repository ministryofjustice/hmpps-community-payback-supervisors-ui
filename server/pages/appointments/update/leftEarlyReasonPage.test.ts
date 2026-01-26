import { UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import { contactOutcomesFactory } from '../../../testutils/factories/contactOutcomeFactory'
import LeftEarlyReasonPage from './leftEarlyReasonPage'

jest.mock('../../../models/offender')

describe('LeftEarlyReasonPage', () => {
  const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('viewData', () => {
    const { contactOutcomes } = contactOutcomesFactory.build()
    const startTime = '09:00'
    const projectCode = 'XR3'
    const appointment = appointmentFactory.build({ id: 1, startTime, projectCode })

    it('should return an object with correct data', () => {
      const appointmentId = '1'
      const offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }

      offenderMock.mockImplementation(() => {
        return offender
      })

      const page = new LeftEarlyReasonPage()
      const result = page.viewData(appointment, contactOutcomes)
      expect(result).toEqual({
        offender,
        backPath: paths.appointments.leftEarly.endTime({ appointmentId, projectCode }),
        updatePath: paths.appointments.leftEarly.reason({ appointmentId, projectCode }),
        title: `Why did Sam Smith leave early?`,
        notes: null,
        isSensitive: false,
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

    describe('when a value for leftEarlyReason exists in the query', () => {
      it('should set checked to true on the corresponding contact outcome', () => {
        const page = new LeftEarlyReasonPage({ leftEarlyReason: contactOutcomes[0].code })
        const result = page.viewData(appointment, contactOutcomes)
        expect(result.items).toEqual([
          {
            text: contactOutcomes[0].name,
            value: contactOutcomes[0].code,
            checked: true,
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
        ])
      })
    })

    describe('when a value for notes exists in the query', () => {
      it('should return the notes value', () => {
        const page = new LeftEarlyReasonPage({ notes: 'notes' })
        const result = page.viewData(appointment, contactOutcomes)
        expect(result.notes).toEqual('notes')
      })
    })

    describe('when a value for isSensitive exists in the query', () => {
      it('should return true for isSensitive if a value is present', () => {
        const page = new LeftEarlyReasonPage({ isSensitive: 'isSensitive' })
        const result = page.viewData(appointment, contactOutcomes)
        expect(result.isSensitive).toEqual(true)
      })

      it('should return false for isSensitive if a value is not present', () => {
        const page = new LeftEarlyReasonPage({ isSensitive: null })
        const result = page.viewData(appointment, contactOutcomes)
        expect(result.isSensitive).toEqual(false)
      })
    })
  })

  describe('next', () => {
    it('should return path to the left early compliance page with project code and appointment Id', () => {
      const appointmentId = '1'
      const projectCode = '2'
      const contactOutcomeCode = 'code'
      const page = new LeftEarlyReasonPage({ leftEarlyReason: contactOutcomeCode })
      const result = page.nextPath(appointmentId, projectCode)

      expect(result).toEqual(
        paths.appointments.leftEarly.compliance({ projectCode, appointmentId, contactOutcomeCode }),
      )
    })
  })

  describe('validate', () => {
    describe('when leftEarlyReason is not present', () => {
      it('should return true for page.hasError', () => {
        const page = new LeftEarlyReasonPage({})
        page.validate()

        expect(page.hasErrors).toEqual(true)
      })

      it('should return the correct error', () => {
        const page = new LeftEarlyReasonPage({})
        page.validate()

        expect(page.validationErrors.leftEarlyReason).toEqual({
          text: 'Select why they cannot continue this session',
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
      const page = new LeftEarlyReasonPage({ leftEarlyReason: 'BBBB' })

      const result = page.requestBody(appointment)

      expect(result.contactOutcomeCode).toEqual('BBBB')
    })

    describe('notes', () => {
      it('returns the original appointment object with updated notes', () => {
        const appointment = appointmentFactory.build({
          notes: 'xxxxx',
          id: 1,
          version: '2',
          contactOutcomeCode: 'AAAA',
        })
        const page = new LeftEarlyReasonPage({ leftEarlyReason: 'BBBB', notes: 'yyyyy' })

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
        const page = new LeftEarlyReasonPage({ leftEarlyReason: 'BBBB' })

        const result = page.requestBody(appointment)

        expect(result.notes).toBeNull()
      })
    })

    describe('sensitive', () => {
      it('returns true if isSensitive is checked', () => {
        const appointment = appointmentFactory.build({
          sensitive: false,
        })
        const page = new LeftEarlyReasonPage({ leftEarlyReason: 'BBBB', isSensitive: 'isSensitive' })

        const result = page.requestBody(appointment)

        expect(result.sensitive).toEqual(true)
      })

      it('returns unchanged (true) if isSensitive is not checked', () => {
        const appointment = appointmentFactory.build({
          sensitive: true,
        })
        const page = new LeftEarlyReasonPage({ leftEarlyReason: 'BBBB' })

        const result = page.requestBody(appointment)

        expect(result.sensitive).toBe(true)
      })

      it('returns unchanged (false) if isSensitive is not checked', () => {
        const appointment = appointmentFactory.build({
          sensitive: false,
        })
        const page = new LeftEarlyReasonPage({ leftEarlyReason: 'BBBB' })

        const result = page.requestBody(appointment)

        expect(result.sensitive).toBe(false)
      })

      it('returns unchanged (undefined) if isSensitive is not checked', () => {
        const appointment = appointmentFactory.build({
          sensitive: undefined,
        })
        const page = new LeftEarlyReasonPage({ leftEarlyReason: 'BBBB' })

        const result = page.requestBody(appointment)

        expect(result.sensitive).toBeUndefined()
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
      const page = new LeftEarlyReasonPage({ leftEarlyReason: 'BBBB' })

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
