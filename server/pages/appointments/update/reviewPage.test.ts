import StatusTagUtils from '../../../utils/GovUKFrontend/statusTagUtils'
import ReviewPage from './reviewPage'

describe('ReviewPage', () => {
  describe('viewData', () => {
    describe('when showWillAlertPractitionerMessage is true', () => {
      it('should return an object with correct data', () => {
        const url = 'link?q=1'

        const page = new ReviewPage('test', 'Absent', { 'Test key': 'Test value' }, true, url)

        const link = `<a href=${url} class="govuk-link govuk-link--no-visited-state">Change</a>`

        jest.spyOn(StatusTagUtils, 'getHtml').mockReturnValue('Absent')

        expect(page.viewData()).toEqual({
          rows: [
            [{ text: 'Test key' }, { html: 'Test value' }, { html: link }],
            [{ text: 'Outcome status' }, { html: 'Absent' }, { text: '' }],
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

        const page = new ReviewPage('test', 'Absent', { 'Test key': 'Test value' }, false, url)

        const link = `<a href=${url} class="govuk-link govuk-link--no-visited-state">Change</a>`

        jest.spyOn(StatusTagUtils, 'getHtml').mockReturnValue('Absent')

        expect(page.viewData()).toEqual({
          rows: [
            [{ text: 'Test key' }, { html: 'Test value' }, { html: link }],
            [{ text: 'Outcome status' }, { html: 'Absent' }, { text: '' }],
          ],
          template: './test.njk',
          showWillAlertPractitionerMessage: false,
          alertPractitionerItems: [
            {
              checked: true,
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
