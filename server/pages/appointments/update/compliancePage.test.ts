import { AppointmentDto } from '../../../@types/shared'
import { AppointmentOutcomeForm } from '../../../@types/user-defined'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import appointmentOutcomeFormFactory from '../../../testutils/factories/appointmentOutcomeFormFactory'
import CompliancePage, { ComplianceQuery } from './compliancePage'

jest.mock('../../../models/offender')

describe('CompliancePage', () => {
  let page: CompliancePage
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
      page = new CompliancePage('completed', formId, {})
      appointment = appointmentFactory.build()
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

      const result = page.viewData(appointment, form)

      expect(result.offender).toBe(offender)
    })

    describe('backPath', () => {
      it('should be to endTime if action is "completed"', () => {
        page = new CompliancePage('completed', formId, {})
        const result = page.viewData(appointment, form)
        expect(result.backPath).toBe(
          `${paths.appointments.completed.endTime({
            projectCode: appointment.projectCode,
            appointmentId: appointment.id.toString(),
          })}?form=${formId}`,
        )
      })
    })

    it('should return an object containing an update link for the form', () => {
      page = new CompliancePage('completed', formId, {})
      const result = page.viewData(appointment, form)
      expect(result.updatePath).toBe(
        `${paths.appointments.completed.compliance({
          projectCode: appointment.projectCode,
          appointmentId: appointment.id.toString(),
        })}?form=${formId}`,
      )
    })

    describe('items', () => {
      it('should return items for workQuality', async () => {
        appointment = appointmentFactory.build({ attendanceData: { workQuality: null } })

        const result = page.viewData(appointment, form)
        expect(result.workQualityItems).toEqual([
          { text: 'Excellent', value: 'EXCELLENT', checked: false },
          { text: 'Good', value: 'GOOD', checked: false },
          { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
          { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: false },
          { text: 'Poor', value: 'POOR', checked: false },
          { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
        ])
      })

      it('should return items for behaviour', async () => {
        appointment = appointmentFactory.build({ attendanceData: { behaviour: null } })

        const result = page.viewData(appointment, form)
        expect(result.behaviourItems).toEqual([
          { text: 'Excellent', value: 'EXCELLENT', checked: false },
          { text: 'Good', value: 'GOOD', checked: false },
          { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
          { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: false },
          { text: 'Poor', value: 'POOR', checked: false },
          { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
        ])
      })

      describe('populated form data', () => {
        it('should populate with query values if query exists', () => {
          const query: ComplianceQuery = {
            workQuality: null,
            behaviour: 'GOOD',
          }

          appointment = appointmentFactory.build({
            attendanceData: { workQuality: 'GOOD', behaviour: 'EXCELLENT' },
            notes: 'some note',
          })

          page = new CompliancePage('completed', formId, query)
          const result = page.viewData(appointment, form)

          expect(result).toEqual(
            expect.objectContaining({
              workQualityItems: [
                { text: 'Excellent', value: 'EXCELLENT', checked: false },
                { text: 'Good', value: 'GOOD', checked: false },
                { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
                { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: false },
                { text: 'Poor', value: 'POOR', checked: false },
                { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
              ],
              behaviourItems: [
                { text: 'Excellent', value: 'EXCELLENT', checked: false },
                { text: 'Good', value: 'GOOD', checked: true },
                { text: 'Satisfactory', value: 'SATISFACTORY', checked: false },
                { text: 'Unsatisfactory', value: 'UNSATISFACTORY', checked: false },
                { text: 'Poor', value: 'POOR', checked: false },
                { text: 'Not applicable', value: 'NOT_APPLICABLE', checked: false },
              ],
            }),
          )
        })
      })
    })
  })

  describe('validate', () => {
    const action = 'completed'
    describe('when workQuality is not present', () => {
      it('should return the correct error', () => {
        page = new CompliancePage(action, formId, { workQuality: null })
        page.validate()

        expect(page.validationErrors.workQuality).toEqual({
          text: 'Select a description of the quality of their work ',
        })
        expect(page.hasErrors).toBe(true)
      })
    })

    describe('when behaviour is not present', () => {
      it('should return the correct error', () => {
        page = new CompliancePage(action, formId, { behaviour: null })
        page.validate()

        expect(page.validationErrors.behaviour).toEqual({
          text: 'Select a description of their behaviour ',
        })
        expect(page.hasErrors).toBe(true)
      })
    })
  })

  describe('next', () => {
    it('should return notes page link', () => {
      const appointmentId = '1'
      const projectCode = '2'
      page = new CompliancePage('completed', formId, {})

      expect(page.nextPath(projectCode, appointmentId)).toBe(
        `${paths.appointments.notes.completed({ projectCode, appointmentId })}?form=${formId}`,
      )
    })
  })
})
