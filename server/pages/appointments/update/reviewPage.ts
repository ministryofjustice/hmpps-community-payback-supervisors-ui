import { AppointmentStatusType } from '../../../@types/user-defined'
import AppointmentUtils from '../../../utils/appointmentUtils'
import StatusTagUtils from '../../../utils/GovUKFrontend/statusTagUtils'

export type ReviewItem = Record<string, string | { value: string; changeUrl: string }>

type OutputRow = OutputItem[]

type OutputItem = {
  text?: string
  html?: string
}

interface ViewData {
  rows: OutputRow[]
  template: string
}

export default class ReviewPage {
  constructor(
    private readonly template: string,
    private readonly outcome: AppointmentStatusType,
    private readonly reviewFields: ReviewItem,
    protected changeUrl?: string,
  ) {
    this.template = `./${this.template}.njk`
  }

  viewData(): ViewData {
    return {
      rows: this.buildRows(),
      template: this.template,
    }
  }

  protected mappedReviewFields(): ReviewItem {
    return this.reviewFields
  }

  private buildRows(): OutputRow[] {
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
        html: StatusTagUtils.getHtml(
          this.outcome,
          AppointmentUtils.statusTagColour[this.outcome as AppointmentStatusType],
        ),
      },
      { text: '' },
    ])

    return fields
  }
}
