import { UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import { AppointmentOutcomeForm } from '../../../@types/user-defined'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import appointmentOutcomeFormFactory from '../../../testutils/factories/appointmentOutcomeFormFactory'
import { contactOutcomesFactory } from '../../../testutils/factories/contactOutcomeFactory'
import LeftEarlyReasonPage from './leftEarlyReasonPage'

jest.mock('../../../models/offender')

describe('LeftEarlyReasonPage', () => {
  let form: AppointmentOutcomeForm
  const formId = '12'
  const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>

  beforeEach(() => {
    jest.resetAllMocks()
    form = appointmentOutcomeFormFactory.build()
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

      const page = new LeftEarlyReasonPage(formId)
      const result = page.viewData(appointment, contactOutcomes, form)
      expect(result).toEqual({
        offender,
        backPath: `${paths.appointments.leftEarly.endTime({ appointmentId, projectCode })}?form=${formId}`,
        updatePath: `${paths.appointments.leftEarly.reason({ appointmentId, projectCode })}?form=${formId}`,
        title: `Why did Sam Smith leave early?`,
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
        const page = new LeftEarlyReasonPage(formId, { leftEarlyReason: contactOutcomes[0].code })
        const result = page.viewData(appointment, contactOutcomes, form)
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
  })

  describe('next', () => {
    it('should return path to the left early compliance page with project code and appointment Id', () => {
      const appointmentId = '1'
      const projectCode = '2'
      const contactOutcomeCode = 'code'
      const page = new LeftEarlyReasonPage(formId, { leftEarlyReason: contactOutcomeCode })
      const result = page.nextPath(appointmentId, projectCode)

      expect(result).toEqual(
        `${paths.appointments.leftEarly.compliance({ projectCode, appointmentId })}?form=${formId}`,
      )
    })
  })

  describe('validate', () => {
    describe('when leftEarlyReason is not present', () => {
      it('should return true for page.hasError', () => {
        const page = new LeftEarlyReasonPage(formId)
        page.validate()

        expect(page.hasErrors).toEqual(true)
      })

      it('should return the correct error', () => {
        const page = new LeftEarlyReasonPage(formId)
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
      const page = new LeftEarlyReasonPage(formId, { leftEarlyReason: 'BBBB' })

      const result = page.requestBody(appointment)

      expect(result.contactOutcomeCode).toEqual('BBBB')
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
      const page = new LeftEarlyReasonPage(formId, { leftEarlyReason: 'BBBB' })

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

  describe('updatedFormData', () => {
    it('returns leftEarlyReason query value as contactOutcome code', () => {
      const page = new LeftEarlyReasonPage(formId, { leftEarlyReason: 'AATC' })

      const result = page.updatedFormData(form)

      expect(result).toEqual({ ...form, contactOutcomeCode: 'AATC' })
    })
  })
})
