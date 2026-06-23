import { GovUkStatusTagColour } from '../@types/user-defined'
import HtmlUtils from './htmlUtils'

describe('HTMLUtils', () => {
  describe('getStatusTag', () => {
    const colours = ['grey', 'red', 'yellow']
    it.each(colours)('returns a GOV.UK Frontend status tag component with the given colour and label', colour => {
      const result = HtmlUtils.getStatusTag('Label', colour as GovUkStatusTagColour)
      expect(result).toEqual(`<strong class="govuk-tag govuk-tag--${colour} cpb-unset-max-width">Label</strong>`)
    })
  })

  describe('getStatusTagClass', () => {
    it.each(['grey', 'red', 'yellow', 'teal'])('returns the status tag class for %s colour', colour => {
      const result = HtmlUtils.getStatusTagClass(colour as GovUkStatusTagColour)
      expect(result).toEqual(`govuk-tag--${colour} cpb-unset-max-width`)
    })
  })
})
