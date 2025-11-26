import { GovUkStatusTagColour } from '../../@types/user-defined'
import StatusTagUtils from './statusTagUtils'

describe('StatusTagUtils', () => {
  describe('getHtml', () => {
    const colours = ['grey', 'red', 'yellow']
    it.each(colours)(
      'returns a GOV.UK Frontend status tag component with the given colour and label',
      (colour: GovUkStatusTagColour) => {
        const result = StatusTagUtils.getHtml('Label', colour)
        expect(result).toEqual(`<strong class="govuk-tag govuk-tag--${colour}">Label</strong>`)
      },
    )
  })
})
