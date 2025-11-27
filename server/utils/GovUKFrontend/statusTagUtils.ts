import { GovUkStatusTagColour } from '../../@types/user-defined'

export default class StatusTagUtils {
  static getHtml = (statusLabel: string, colour: GovUkStatusTagColour): string => {
    return `<strong class="govuk-tag govuk-tag--${colour}">${statusLabel}</strong>`
  }
}
