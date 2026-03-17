import { AppointmentStatusType } from '../../../@types/user-defined'
import AppointmentUtils from '../../../utils/appointmentUtils'
import StatusTagUtils from '../../../utils/GovUKFrontend/statusTagUtils'

interface ViewData {
  rows: OutputItem[]
  template: string
}

type InputItem = Record<string, string>
type OutputItem = {
  key: { text: string }
  value: { html: string }
}

export default class ReviewPage {
  constructor(
    private readonly template: string,
    private readonly outcome: AppointmentStatusType,
    private readonly fields: InputItem,
  ) {
    this.template = `./${this.template}.njk`
  }

  viewData(): ViewData {
    return {
      rows: this.buildRows(),
      template: this.template,
    }
  }

  private buildRows() {
    this.fields['Outcome status'] = StatusTagUtils.getHtml(
      this.outcome,
      AppointmentUtils.statusTagColour[this.outcome as AppointmentStatusType],
    )

    const fields = Object.entries(this.fields).map(object => {
      const [key, value] = object
      return {
        key: { text: key },
        value: { html: value },
      }
    })

    return fields
  }
}
