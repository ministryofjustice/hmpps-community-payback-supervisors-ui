import { contactOutcomeFactory } from '../../../testutils/factories/contactOutcomeFactory'
import AppointmentUtils from '../../../utils/appointmentUtils'
import ReviewPage from './reviewPage'

describe('ReviewPage', () => {
  describe('viewData', () => {
    describe('when showWillAlertPractitionerMessage is true', () => {
      it('should return an object with correct data', () => {
        const url = 'link?q=1'

        const outcome = contactOutcomeFactory.build()

        const page = new ReviewPage('test', outcome, { 'Test key': 'Test value' }, true, url)

        const link = `<a href=${url} class="govuk-link govuk-link--no-visited-state">Change</a>`

        const statusTagHtml = '<strong>Contact outcome name</strong>'
        jest.spyOn(AppointmentUtils, 'buildStatusTag').mockReturnValue(statusTagHtml)

        expect(page.viewData()).toEqual({
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
        const url = 'link?q=1'

        const outcome = contactOutcomeFactory.build({
          willAlertEnforcementDiary: false,
        })

        const page = new ReviewPage('test', outcome, { 'Test key': 'Test value' }, false, url)

        const link = `<a href=${url} class="govuk-link govuk-link--no-visited-state">Change</a>`

        const statusTagHtml = '<strong>Contact outcome name</strong>'
        jest.spyOn(AppointmentUtils, 'buildStatusTag').mockReturnValue(statusTagHtml)

        expect(page.viewData()).toEqual({
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
