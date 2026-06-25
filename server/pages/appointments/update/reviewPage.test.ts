import paths from '../../../paths'
import { AppointmentDto } from '../../../@types/shared'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import { contactOutcomeFactory } from '../../../testutils/factories/contactOutcomeFactory'
import AppointmentUtils from '../../../utils/appointmentUtils'
import ReviewPage from './reviewPage'
import Offender from '../../../models/offender'

jest.mock('../../../models/offender')

describe('ReviewPage', () => {
  describe('viewData', () => {
    let appointment: AppointmentDto
    let offender: object

    beforeEach(() => {
      const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>
      offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }
      offenderMock.mockImplementation(() => {
        return offender
      })
      appointment = appointmentFactory.build()
    })

    describe('when showWillAlertPractitionerMessage is true', () => {
      it('should return an object with correct data', () => {
        const formId = 'form1234'
        const url = `${paths.appointments.notes.absent({ appointmentId: appointment.id.toString(), projectCode: appointment.projectCode })}?form=${formId}`

        const outcome = contactOutcomeFactory.build()

        const page = new ReviewPage('test', { form: formId }, outcome, { 'Test key': 'Test value' }, true)

        const link = `<a href=${url} class="govuk-link govuk-link--no-visited-state">Change</a>`

        const statusTagHtml = '<strong>Contact outcome name</strong>'
        jest.spyOn(AppointmentUtils, 'buildStatusTag').mockReturnValue(statusTagHtml)

        expect(page.viewData(appointment)).toEqual({
          offender,
          backPath: url,
          updatePath: url,
          rows: [
            [{ text: 'Test key' }, { html: 'Test value' }, { html: link }],
            [{ text: 'Outcome status' }, { html: statusTagHtml }, { text: '' }],
          ],
          template: './test.njk',
          showWillAlertPractitionerMessage: true,
          alertDiaryText: 'Would you also like this to be sent to the alert diary?',
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

    describe('when showWillAlertPractitionerMessage is false', () => {
      it('should return an object with correct data', () => {
        const formId = 'form1234'
        const url = `${paths.appointments.notes.absent({ appointmentId: appointment.id.toString(), projectCode: appointment.projectCode })}?form=${formId}`

        const outcome = contactOutcomeFactory.build({
          willAlertEnforcementDiary: false,
        })

        const page = new ReviewPage('test', { form: formId }, outcome, { 'Test key': 'Test value' }, false)

        const link = `<a href=${url} class="govuk-link govuk-link--no-visited-state">Change</a>`

        const statusTagHtml = '<strong>Contact outcome name</strong>'
        jest.spyOn(AppointmentUtils, 'buildStatusTag').mockReturnValue(statusTagHtml)

        expect(page.viewData(appointment)).toEqual({
          offender,
          backPath: url,
          updatePath: url,
          rows: [
            [{ text: 'Test key' }, { html: 'Test value' }, { html: link }],
            [{ text: 'Outcome status' }, { html: statusTagHtml }, { text: '' }],
          ],
          template: './test.njk',
          showWillAlertPractitionerMessage: false,
          alertDiaryText: 'Would you like this to be sent to the alert diary?',
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
