import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import appointmentOutcomeFormFactory from '../../../testutils/factories/appointmentOutcomeFormFactory'
import attendanceDataFactory from '../../../testutils/factories/attendanceDataFactory'
import { contactOutcomesFactory } from '../../../testutils/factories/contactOutcomeFactory'
import StatusTagUtils from '../../../utils/GovUKFrontend/statusTagUtils'
import ComplianceReviewPage from './complianceReviewPage'

describe('ComplianceReviewPage', () => {
  describe('when completed', () => {
    describe('viewData', () => {
      it('should return an object with correct data', () => {
        const projectCode = 'abc123'
        const appointmentId = 789
        const endTime = '13:00'

        const appointment = appointmentFactory.build({
          projectCode,
          id: appointmentId,
        })

        const formId = 'abcxyz456'

        const contactOutcomes = contactOutcomesFactory.build()

        const appointmentOutputForm = appointmentOutcomeFormFactory.build({
          endTime,
          attendanceData: attendanceDataFactory.build(),
        })

        const page = new ComplianceReviewPage(appointment, contactOutcomes, formId, appointmentOutputForm, {
          notes: 'test note',
          isSensitive: 'TRUE',
        })

        const link = (_str: TemplateStringsArray, url: string): string => {
          return `<a href=${url}?form=${formId} class="govuk-link govuk-link--no-visited-state">Change</a>`
        }

        jest.spyOn(StatusTagUtils, 'getHtml').mockReturnValue('Session complete')

        const params = { projectCode, appointmentId: appointmentId.toString() }

        const startTimeChangeLink = link`${paths.appointments.arrived.startTime(params)}`
        const endTimeChangeLink = link`${paths.appointments.completed.endTime(params)}`
        const changeLink = link`${paths.appointments.completed.compliance(params)}`
        const notesLink = link`${paths.appointments.notes.completed(params)}`

        expect(page.viewData()).toEqual({
          rows: [
            [
              { text: 'Start time' },
              { html: '09:00' },
              {
                html: startTimeChangeLink,
              },
            ],
            [
              { text: 'End time' },
              { html: endTime },
              {
                html: endTimeChangeLink,
              },
            ],
            [
              { text: 'Hi-vis' },
              { html: appointmentOutputForm.attendanceData.hiVisWorn ? 'Yes' : 'No' },
              {
                html: changeLink,
              },
            ],
            [
              { text: 'Worked intensively' },
              { html: appointmentOutputForm.attendanceData.workedIntensively ? 'Yes' : 'No' },
              {
                html: changeLink,
              },
            ],
            [
              { text: 'Work quality' },
              { html: 'Good' },
              {
                html: changeLink,
              },
            ],
            [
              { text: 'Behaviour' },
              { html: 'Not applicable' },
              {
                html: changeLink,
              },
            ],
            [
              { text: 'Notes' },
              { html: 'test note' },
              {
                html: notesLink,
              },
            ],
            [
              { text: 'Sensitivity' },
              { html: 'Cannot be shared with person on probation' },
              {
                html: notesLink,
              },
            ],
            [{ text: 'Outcome status' }, { html: 'Session complete' }, { text: '' }],
          ],
          template: './compliance.njk',
          showWillAlertPractitionerMessage: false,
          alertPractitionerItems: [
            {
              checked: false,
              text: 'Yes',
              value: 'yes',
            },
            {
              checked: false,
              text: 'No',
              value: 'no',
            },
          ],
        })
      })
    })
  })
})
