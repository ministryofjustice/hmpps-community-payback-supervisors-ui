import { AppointmentDto, ContactOutcomeDto } from '../../../@types/shared'
import { AppointmentUpdateQuery, GovUkRadioOption, ValidationErrors } from '../../../@types/user-defined'
import paths from '../../../paths'
import AppointmentUtils from '../../../utils/appointmentUtils'
import GovUkRadioGroup from '../../../utils/GovUKFrontend/GovUkRadioGroup'
import { pathWithQuery } from '../../../utils/utils'
import BaseAppointmentUpdatePage from './baseAppointmentUpdatePage'

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

interface Body {
  alertPractitioner?: string
}

export type ReviewQuery = {
  alertPractitioner?: string
} & AppointmentUpdateQuery

export default class ReviewPage extends BaseAppointmentUpdatePage<Body> {
  protected changeUrl: string

  constructor(
    private readonly template: string,
    protected readonly query: ReviewQuery,
    private readonly outcome: ContactOutcomeDto,
    private readonly reviewFields: ReviewItem,
    protected showWillAlertPractitionerMessage: boolean = false,
  ) {
    super()
    this.query = query
    this.template = `./${this.template}.njk`
  }

  nextPath(_appointmentId: string | AppointmentDto, _projectCode: string): string {
    return ''
  }

  protected backPath(appointment: AppointmentDto): string {
    return this.updatePath(appointment)
  }

  protected updatePath(appointment: AppointmentDto): string {
    return pathWithQuery(
      paths.appointments.notes.absent({
        appointmentId: appointment.id.toString(),
        projectCode: appointment.projectCode,
      }),
      {
        form: this.query.form,
      },
    )
  }

  viewData(appointment: AppointmentDto): ViewData {
    return {
      ...this.commonViewData(appointment),
      rows: this.buildRows(appointment),
      template: this.template,
      showWillAlertPractitionerMessage: this.showWillAlertPractitionerMessage,
      alertPractitionerItems: GovUkRadioGroup.yesNoItems({}),
      alertDiaryText: `Would you${this.showWillAlertPractitionerMessage ? ' also' : ''} like this to be sent to the alert diary?`,
    }
  }

  protected getValidationErrors(): ValidationErrors<Body> {
    const errors: ValidationErrors<Body> = {}

    if (!this.query.alertPractitioner) {
      errors.alertPractitioner = { text: 'Choose whether you want to send an alert' }
    }

    return errors
  }

  protected mappedReviewFields(): ReviewItem {
    return this.reviewFields
  }

  private buildRows(appointment: AppointmentDto): OutputRow[] {
    this.changeUrl = this.changeUrl ?? this.backPath(appointment)

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
