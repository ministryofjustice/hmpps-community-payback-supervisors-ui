import { GovUkStatusTagColour } from '../@types/user-defined'

export default class HtmlUtils {
  static getStatusTag = (statusLabel: string, colour: GovUkStatusTagColour): string => {
    return `<strong class="govuk-tag ${this.getStatusTagClass(colour)}">${statusLabel}</strong>`
  }

  static getStatusTagClass(colour: GovUkStatusTagColour): string {
    return `govuk-tag--${colour} cpb-unset-max-width`
  }

  static getHiddenText = (text: string): string => {
    return `<span class="govuk-visually-hidden">${text}</span>`
  }
}
