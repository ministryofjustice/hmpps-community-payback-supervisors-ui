import Offender from '../../../models/offender'
import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import appointmentOutcomeFormFactory from '../../../testutils/factories/appointmentOutcomeFormFactory'
import attendanceDataFactory from '../../../testutils/factories/attendanceDataFactory'
import { contactOutcomeFactory } from '../../../testutils/factories/contactOutcomeFactory'
import HtmlUtils from '../../../utils/htmlUtils'
import ComplianceReviewPage from './complianceReviewPage'

jest.mock('../../../models/offender')

describe('ComplianceReviewPage', () => {
  describe('when completed', () => {
    describe('viewData', () => {
      it('should return an object with correct data', () => {
        const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>
        const offender = {
          name: 'Sam Smith',
          crn: 'CRN123',
          isLimited: false,
        }
        offenderMock.mockImplementation(() => {
          return offender
        })

        const projectCode = 'abc123'
        const appointmentId = 789
        const endTime = '13:00'

        const appointment = appointmentFactory.build({
          projectCode,
          id: appointmentId,
        })

        const formId = 'abcxyz456'

        const outcome = contactOutcomeFactory.build({ willAlertEnforcementDiary: true })

        const appointmentOutputForm = appointmentOutcomeFormFactory.build({
          endTime,
          attendanceData: attendanceDataFactory.build({
            hiVisWorn: true,
            workedIntensively: true,
          }),
          notes: 'test note',
          sensitive: true,
        })

        const page = new ComplianceReviewPage(appointment, { form: formId }, outcome, appointmentOutputForm)

        const link = (_str: TemplateStringsArray, url: string): string => {
          return `<a href=${url}?form=${formId} class="govuk-link govuk-link--no-visited-state">Change</a>`
        }

        const params = { projectCode, appointmentId: appointmentId.toString() }

        const startTimeChangeLink = link`${paths.appointments.arrived.startTime(params)}`
        const endTimeChangeLink = link`${paths.appointments.completed.endTime(params)}`
        const changeLink = link`${paths.appointments.completed.compliance(params)}`
        const notesLink = link`${paths.appointments.notes.completed(params)}`

        const statusTagHtml = '<strong>Contact outcome name</strong>'
        jest.spyOn(HtmlUtils, 'getStatusTag').mockReturnValue(statusTagHtml)

        expect(page.viewData(appointment)).toEqual({
          offender,
          backPath: `${paths.appointments.notes.completed(params)}?form=${formId}`,
          updatePath: `${paths.appointments.notes.completed(params)}?form=${formId}`,
          alertDiaryText: 'Would you also like this to be sent to the alert diary?',
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
            [{ text: 'Outcome status' }, { html: statusTagHtml }, { text: '' }],
          ],
          template: './compliance.njk',
          showWillAlertPractitionerMessage: true,
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
