import { ContactOutcomeDto } from '../../../@types/shared'
import { GovUkRadioOption } from '../../../@types/user-defined'
import AppointmentUtils from '../../../utils/appointmentUtils'
import GovUkRadioGroup from '../../../utils/GovUKFrontend/GovUkRadioGroup'

export type ReviewItem = Record<string, string | { value: string; changeUrl: string }>

type OutputRow = OutputItem[]

type OutputItem = {
  text?: string
  html?: string
}

interface ViewData {
  rows: OutputRow[]
  template: string
  showWillAlertPractitionerMessage: boolean
  alertPractitionerItems: GovUkRadioOption[]
  alertDiaryText: string
}

export default class ReviewPage {
  constructor(
    private readonly template: string,
    private readonly outcome: ContactOutcomeDto,
    private readonly reviewFields: ReviewItem,
    protected showWillAlertPractitionerMessage: boolean = false,
    protected changeUrl?: string,
  ) {
    this.template = `./${this.template}.njk`
  }

  viewData(): ViewData {
    return {
      rows: this.buildRows(),
      template: this.template,
      showWillAlertPractitionerMessage: this.showWillAlertPractitionerMessage,
      alertPractitionerItems: GovUkRadioGroup.yesNoItems({}),
      alertDiaryText: `Would you${this.showWillAlertPractitionerMessage ? ' also' : ''} like this to be sent to the alert diary?`,
    }
  }

  protected mappedReviewFields(): ReviewItem {
    return this.reviewFields
  }

  private buildRows(): OutputRow[] {
    const statusTagHtml = AppointmentUtils.buildStatusTag(this.outcome)

    const fields = Object.entries(this.mappedReviewFields()).map(([key, v]) => {
      const { value, changeUrl } = typeof v === 'string' ? { value: v, changeUrl: undefined } : v

      return [
        { text: key },
        { html: value },
        {
          html: `<a href=${changeUrl || this.changeUrl} class="govuk-link govuk-link--no-visited-state">Change</a>`,
        },
      ]
    })

    fields.push([
      { text: 'Outcome status' },
      {
        html: statusTagHtml,
      },
      { text: '' },
    ])

    return fields
  }
}
