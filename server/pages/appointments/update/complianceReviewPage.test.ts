import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import appointmentOutcomeFormFactory from '../../../testutils/factories/appointmentOutcomeFormFactory'
import { contactOutcomeFactory, contactOutcomesFactory } from '../../../testutils/factories/contactOutcomeFactory'
import StatusTagUtils from '../../../utils/GovUKFrontend/statusTagUtils'
import ComplianceReviewPage from './complianceReviewPage'

describe('ComplianceReviewPage', () => {
  describe('when left early', () => {
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

        const attendanceOutcomeLabel = 'Left early - for reason'

        const contactOutcomes = contactOutcomesFactory.build({
          contactOutcomes: [contactOutcomeFactory.build({ name: attendanceOutcomeLabel, code: '123' })],
        })

        const appointmentOutputForm = appointmentOutcomeFormFactory.build({
          endTime,
          contactOutcomeCode: '123',
        })

        const page = new ComplianceReviewPage(
          'leftEarly',
          appointment,
          contactOutcomes,
          formId,
          appointmentOutputForm,
          {
            hiVis: 'yes',
            workedIntensively: 'yes',
            workQuality: 'GOOD',
            behaviour: 'GOOD',
            notes: 'test note',
            isSensitive: 'TRUE',
          },
        )

        const link = (_str: TemplateStringsArray, url: string): string => {
          return `<a href=${url}?form=${formId} class="govuk-link govuk-link--no-visited-state">Change</a>`
        }

        jest.spyOn(StatusTagUtils, 'getHtml').mockReturnValue('Left early')

        const params = { projectCode, appointmentId: appointmentId.toString() }

        const timeChangeLink = link`${paths.appointments.leftEarly.endTime(params)}`
        const attendanceChangeLink = link`${paths.appointments.leftEarly.reason(params)}`
        const changeLink = link`${paths.appointments.leftEarly.compliance(params)}`

        expect(page.viewData()).toEqual({
          rows: [
            [
              { text: 'Attendance' },
              { html: attendanceOutcomeLabel },
              {
                html: attendanceChangeLink,
              },
            ],
            [
              { text: 'Time' },
              { html: endTime },
              {
                html: timeChangeLink,
              },
            ],
            [
              { text: 'Hi-vis' },
              { html: 'Yes' },
              {
                html: changeLink,
              },
            ],
            [
              { text: 'Worked intensively' },
              { html: 'Yes' },
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
              { html: 'Good' },
              {
                html: changeLink,
              },
            ],
            [
              { text: 'Notes' },
              { html: 'test note' },
              {
                html: changeLink,
              },
            ],
            [
              { text: 'Sensitivity' },
              { html: 'Cannot be shared with person on probation' },
              {
                html: changeLink,
              },
            ],
            [{ text: 'Outcome status' }, { html: 'Left early' }, { text: '' }],
          ],
          template: './compliance.njk',
        })
      })
    })
  })

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
        })

        const page = new ComplianceReviewPage(
          'completed',
          appointment,
          contactOutcomes,
          formId,
          appointmentOutputForm,
          {
            hiVis: 'yes',
            workedIntensively: 'yes',
            workQuality: 'GOOD',
            behaviour: 'GOOD',
            notes: 'test note',
            isSensitive: 'TRUE',
          },
        )

        const link = (_str: TemplateStringsArray, url: string): string => {
          return `<a href=${url}?form=${formId} class="govuk-link govuk-link--no-visited-state">Change</a>`
        }

        jest.spyOn(StatusTagUtils, 'getHtml').mockReturnValue('Session complete')

        const params = { projectCode, appointmentId: appointmentId.toString() }

        const timeChangeLink = link`${paths.appointments.completed.endTime(params)}`
        const changeLink = link`${paths.appointments.completed.compliance(params)}`

        expect(page.viewData()).toEqual({
          rows: [
            [
              { text: 'Time' },
              { html: endTime },
              {
                html: timeChangeLink,
              },
            ],
            [
              { text: 'Hi-vis' },
              { html: 'Yes' },
              {
                html: changeLink,
              },
            ],
            [
              { text: 'Worked intensively' },
              { html: 'Yes' },
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
              { html: 'Good' },
              {
                html: changeLink,
              },
            ],
            [
              { text: 'Notes' },
              { html: 'test note' },
              {
                html: changeLink,
              },
            ],
            [
              { text: 'Sensitivity' },
              { html: 'Cannot be shared with person on probation' },
              {
                html: changeLink,
              },
            ],
            [{ text: 'Outcome status' }, { html: 'Session complete' }, { text: '' }],
          ],
          template: './compliance.njk',
        })
      })
    })
  })
})
