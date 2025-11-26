import { UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import { contactOutcomesFactory } from '../../../testutils/factories/contactOutcomeFactory'
import UnableToWorkPage from './unableToWorkPage'

jest.mock('../../../models/offender')

describe('UnableToWorkPage', () => {
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

      const page = new UnableToWorkPage()
      const result = page.viewData(appointment, contactOutcomes)
      expect(result).toEqual({
        offender,
        backPath: paths.appointments.arrived.isAbleToWork({ appointmentId, projectCode }),
        updatePath: paths.appointments.arrived.unableToWork({ appointmentId, projectCode }),
        title: `Why is Sam Smith unable to work today?`,
        items: [
          {
            text: contactOutcomes[0].name,
            value: contactOutcomes[0].code,
          },
          {
            text: contactOutcomes[1].name,
            value: contactOutcomes[1].code,
          },
          {
            text: contactOutcomes[2].name,
            value: contactOutcomes[2].code,
          },
        ],
      })
    })
  })

  describe('next', () => {
    it('should return path to the confirm unable to work page with project code and appointment Id', () => {
      const appointmentId = '1'
      const projectCode = '2'
      const page = new UnableToWorkPage()
      const result = page.nextPath(appointmentId, projectCode)

      expect(result).toEqual(paths.appointments.confirm.unableToWork({ projectCode, appointmentId }))
    })
  })

  describe('validate', () => {
    describe('when unableToWork is not present', () => {
      it('should return true for page.hasError', () => {
        const page = new UnableToWorkPage({})
        page.validate()

        expect(page.hasErrors).toEqual(true)
      })

      it('should return the correct error', () => {
        const page = new UnableToWorkPage({})
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
      const page = new UnableToWorkPage({ unableToWork: 'BBBB' })

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
      })
      const page = new UnableToWorkPage({ unableToWork: 'BBBB' })

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
        notes: appointment.notes,
      }

      expect(result).toEqual(expected)
    })
  })
})
