import { AppointmentStatusType } from '../../../@types/user-defined'
import AppointmentUtils from '../../../utils/appointmentUtils'
import StatusTagUtils from '../../../utils/GovUKFrontend/statusTagUtils'

type InputItem = Record<string, string>

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
    private readonly fields: InputItem,
    private readonly changeLink?: string,
  ) {
    this.template = `./${this.template}.njk`
  }

  viewData(): ViewData {
    return {
      rows: this.buildRows(),
      template: this.template,
    }
  }

  private buildRows(): OutputRow[] {
    const fields = Object.entries(this.fields).map(object => {
      const [key, value] = object
      return [
        { text: key },
        { html: value },
        {
          html: `<a href=${this.changeLink} class="govuk-link govuk-link--no-visited-state">Change</a>`,
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
