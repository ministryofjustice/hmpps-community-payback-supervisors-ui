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

  describe('getHiddenText', () => {
    it('returns an element with the govuk hidden class containing given content', () => {
      const result = HtmlUtils.getHiddenText('Some content')

      expect(result).toEqual('<span class="govuk-visually-hidden">Some content</span>')
    })
  })

  describe('escape', () => {
    it('escapes HTML special characters', () => {
      const result = HtmlUtils.escape(`<script>alert("x" & 'y')</script>`)

      expect(result).toEqual('&lt;script&gt;alert(&quot;x&quot; &amp; &#39;y&#39;)&lt;/script&gt;')
    })
  })
})
