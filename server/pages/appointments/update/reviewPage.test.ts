import { contactOutcomeFactory } from '../../../testutils/factories/contactOutcomeFactory'
import HtmlUtils from '../../../utils/htmlUtils'
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
        jest.spyOn(HtmlUtils, 'getStatusTag').mockReturnValue(statusTagHtml)

        expect(page.viewData()).toEqual({
          rows: [
            [{ text: 'Test key' }, { html: 'Test value' }, { html: link }],
            [{ text: 'Outcome status' }, { html: statusTagHtml }, { text: '' }],
          ],
          template: './test.njk',
          showWillAlertPractitionerMessage: true,
          alertPractitionerItems: [],
        })
      })
    })

    describe('when showWillAlertPractitionerMessage is false', () => {
      it('should return an object with correct data', () => {
        const url = 'link?q=1'

        const outcome = contactOutcomeFactory.build()

        const page = new ReviewPage('test', outcome, { 'Test key': 'Test value' }, false, url)

        const link = `<a href=${url} class="govuk-link govuk-link--no-visited-state">Change</a>`

        const statusTagHtml = '<strong>Contact outcome name</strong>'
        jest.spyOn(HtmlUtils, 'getStatusTag').mockReturnValue(statusTagHtml)

        expect(page.viewData()).toEqual({
          rows: [
            [{ text: 'Test key' }, { html: 'Test value' }, { html: link }],
            [{ text: 'Outcome status' }, { html: statusTagHtml }, { text: '' }],
          ],
          template: './test.njk',
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
