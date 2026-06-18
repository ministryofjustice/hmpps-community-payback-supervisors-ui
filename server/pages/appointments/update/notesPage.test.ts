import { faker } from '@faker-js/faker'
import { AppointmentDto } from '../../../@types/shared'
import { AppointmentOutcomeForm } from '../../../@types/user-defined'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import appointmentOutcomeFormFactory from '../../../testutils/factories/appointmentOutcomeFormFactory'
import GovUkRadioGroup from '../../../utils/GovUKFrontend/GovUkRadioGroup'
import NotesPage from './notesPage'
import StartTimePage from './startTimePage'

jest.mock('../../../models/offender')

describe('NotesPage', () => {
  let page: NotesPage
  let appointment: AppointmentDto
  let form: AppointmentOutcomeForm
  const formId = '12'

  beforeEach(() => {
    jest.resetAllMocks()
    form = appointmentOutcomeFormFactory.build()
  })

  describe('viewData', () => {
    const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>

    beforeEach(() => {
      appointment = appointmentFactory.build()
      page = new NotesPage({ action: 'completed', query: {}, appointment })
    })

    it('should return an object containing offender', () => {
      const offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }

      offenderMock.mockImplementation(() => {
        return offender
      })

      const result = page.viewData(form)

      expect(result.offender).toBe(offender)
    })

    describe('backPath', () => {
      it('should be to compliance if action is "completed"', () => {
        page = new NotesPage({ action: 'completed', query: { form: formId }, appointment })
        const result = page.viewData(form)
        expect(result.backPath).toBe(
          `${paths.appointments.completed.compliance({
            projectCode: appointment.projectCode,
            appointmentId: appointment.id.toString(),
          })}?form=${formId}`,
        )
      })
      it('should be to show appointment if action is "absent"', () => {
        page = new NotesPage({ action: 'absent', query: { form: formId }, appointment })
        const result = page.viewData(form)
        expect(result.backPath).toBe(
          paths.appointments.show({
            projectCode: appointment.projectCode,
            appointmentId: appointment.id.toString(),
          }),
        )
      })
    })

    describe('updateLink', () => {
      it('should return an object containing an update link for the form (completed)', () => {
        page = new NotesPage({ action: 'completed', query: { form: formId }, appointment })
        const result = page.viewData(form)
        expect(result.updatePath).toBe(
          `${paths.appointments.review.completed({
            projectCode: appointment.projectCode,
            appointmentId: appointment.id.toString(),
          })}?form=${formId}`,
        )
      })

      it('should return an object containing an update link for the form (absent)', () => {
        page = new NotesPage({ action: 'absent', query: { form: formId }, appointment })
        const result = page.viewData(form)
        expect(result.updatePath).toBe(
          `${paths.appointments.review.absent({
            projectCode: appointment.projectCode,
            appointmentId: appointment.id.toString(),
          })}?form=${formId}`,
        )
      })
    })

    describe('notes in the query', () => {
      const action = 'completed'

      it('should return notes if a value is present', () => {
        page = new NotesPage({ action, query: { notes: 'test note' }, appointment })
        const result = page.viewData(form)
        expect(result.notes).toEqual('test note')
      })

      it('should return null for isSensitive if a value is not present', () => {
        page = new NotesPage({ action, query: {}, appointment })
        const result = page.viewData(form)
        expect(result.notes).not.toBeDefined()
      })
    })

    describe('isSensitive in the query', () => {
      const action = 'completed'

      it('should return true for isSensitive if a value is present', () => {
        page = new NotesPage({ action, query: { isSensitive: 'true' }, appointment })
        const result = page.viewData(form)
        expect(result.isSensitive).toEqual(true)
      })

      it('should return false for isSensitive if a value is not present', () => {
        page = new NotesPage({ action, query: {}, appointment })
        form = appointmentOutcomeFormFactory.build({ sensitive: false })
        const result = page.viewData(form)
        expect(result.isSensitive).toEqual(false)
      })
    })
  })

  describe('validate', () => {
    const action = 'completed'

    describe('notes', () => {
      it('should not have any errors if no notes value', () => {
        page = new NotesPage({ action, query: { notes: null }, appointment })
        page.validate()

        expect(page.validationErrors.notes).toBeFalsy()
      })

      it.each([4000, 3999, 0])('should not have any errors if notes count is less than 4000', (count: number) => {
        const notes = faker.string.alpha(count)
        page = new NotesPage({ action, query: { notes }, appointment })
        page.validate()

        expect(page.validationErrors.notes).toBeFalsy()
      })

      it('should have errors if the notes count is greater than 4000', () => {
        const notes = faker.string.alpha(4001)
        page = new NotesPage({ action, query: { notes }, appointment })
        page.validate()

        expect(page.validationErrors.notes).toEqual({
          text: 'Notes must be 4000 characters or less',
        })
      })
    })
  })

  describe('next', () => {
    it('should return confirm page link for completed action', () => {
      const appointmentId = '1'
      const projectCode = '2'
      page = new NotesPage({ action: 'completed', query: {}, appointment })

      expect(page.nextPath(projectCode, appointmentId)).toBe(
        paths.appointments.confirm.completed({ projectCode, appointmentId }),
      )
    })

    it('should return confirm page link for absent action', () => {
      const appointmentId = '1'
      const projectCode = '2'
      page = new NotesPage({ action: 'absent', query: {}, appointment })

      expect(page.nextPath(projectCode, appointmentId)).toBe(
        paths.appointments.confirm.absent({ projectCode, appointmentId }),
      )
    })
  })

  describe('buildPayload', () => {
    beforeEach(() => {
      appointment = appointmentFactory.build()
      jest.spyOn(GovUkRadioGroup, 'valueFromYesOrNoItem').mockReturnValue(false)
    })

    describe('absent', () => {
      it('returns data from the appointment except for notes, sensitive, and the outcome code', () => {
        form = appointmentOutcomeFormFactory.build({
          notes: 'testnote',
          sensitive: true,
          contactOutcomeCode: StartTimePage.UnacceptableAbsenceOutcomeCode,
        })

        page = new NotesPage({ action: 'absent', query: {}, appointment })

        const result = page.buildPayload(appointment, form)

        expect(result).toEqual(
          expect.objectContaining({
            deliusId: appointment.id,
            deliusVersionToUpdate: appointment.version,
            alertActive: appointment.alertActive,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            attendanceData: appointment.attendanceData,
            enforcementData: appointment.enforcementData,
            supervisorOfficerCode: appointment.supervisorOfficerCode,
            date: appointment.date,
            notes: 'testnote',
            sensitive: true,
            contactOutcomeCode: StartTimePage.UnacceptableAbsenceOutcomeCode,
          }),
        )
      })
    })

    describe('completed', () => {
      it('returns data from the form and query', () => {
        form = appointmentOutcomeFormFactory.build({
          notes: 'testnote',
          sensitive: false,
          contactOutcomeCode: 'ABCD',
        })

        page = new NotesPage({ action: 'completed', query: { alertPractitioner: 'yes' }, appointment })

        const result = page.buildPayload(appointment, form)

        expect(result).toEqual(
          expect.objectContaining({
            deliusId: appointment.id,
            deliusVersionToUpdate: form.deliusVersion,
            startTime: form.startTime,
            endTime: form.endTime,
            attendanceData: {
              ...appointment.attendanceData,
              ...form.attendanceData,
            },
            enforcementData: appointment.enforcementData,
            supervisorOfficerCode: appointment.supervisorOfficerCode,
            date: appointment.date,
            alertActive: true,
            sensitive: form.sensitive,
            contactOutcomeCode: 'ABCD',
            notes: 'testnote',
          }),
        )
      })
    })

    it('saves the correct outcome code if the action is completed', () => {
      page = new NotesPage({ action: 'completed', query: {}, appointment })
      form = appointmentOutcomeFormFactory.build({
        contactOutcomeCode: 'ABCD',
      })

      const result = page.buildPayload(appointment, form)

      expect(result.contactOutcomeCode).toEqual('ABCD')
    })
  })
})
