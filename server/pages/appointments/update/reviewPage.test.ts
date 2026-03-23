import StatusTagUtils from '../../../utils/GovUKFrontend/statusTagUtils'
import ReviewPage from './reviewPage'

describe('ReviewPage', () => {
  describe('viewData', () => {
    it('should return an object with correct data', () => {
      const url = 'link?q=1'

      const page = new ReviewPage('test', 'Absent', { 'Test key': 'Test value' }, url)

      const link = `<a href=${url} class="govuk-link govuk-link--no-visited-state">Change</a>`

      jest.spyOn(StatusTagUtils, 'getHtml').mockReturnValue('Absent')

      expect(page.viewData()).toEqual({
        rows: [
          [{ text: 'Test key' }, { html: 'Test value' }, { html: link }],
          [{ text: 'Outcome status' }, { html: 'Absent' }, { text: '' }],
        ],
        template: './test.njk',
      })
    })
  })
})
