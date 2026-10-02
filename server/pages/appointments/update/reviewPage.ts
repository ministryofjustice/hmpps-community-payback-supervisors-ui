import { AppointmentDto, ContactOutcomeDto, SupervisorDto, UpdateAppointmentDto } from '../../../@types/shared'
import {
  AppointmentNotesAction,
  AppointmentOutcomeForm,
  AppointmentUpdateQuery,
  GovUkRadioOption,
  ValidationErrors,
  YesOrNo,
} from '../../../@types/user-defined'
import paths from '../../../paths'
import ReferenceDataService from '../../../services/referenceDataService'
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

  formId: string | undefined

  constructor(
    private action: AppointmentNotesAction,
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

  nextPath(projectCode: string, appointmentId: string): string {
    return this.pathWithFormId(paths.appointments.confirm[this.action]({ projectCode, appointmentId }))
  }

  protected backPath(appointment: AppointmentDto): string {
    return pathWithQuery(
      paths.appointments.notes[this.action]({
        appointmentId: appointment.id.toString(),
        projectCode: appointment.projectCode,
      }),
      {
        form: this.query.form,
      },
    )
  }

  protected updatePath(appointment: AppointmentDto): string {
    return pathWithQuery(
      paths.appointments.review[this.action]({
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

    const outcomeLink = pathWithQuery(
      paths.appointments.attendanceOutcome({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      { form: this.query.form },
    )

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

    const outcomeField = [
      { text: 'Outcome' },
      {
        html: statusTagHtml,
      },
    ].concat(
      this.outcome?.attended
        ? [
            {
              html: `<a href='${outcomeLink}' class="govuk-link govuk-link--no-visited-state">Change</a>`,
            },
          ]
        : [{ text: '' }],
    )

    fields.unshift(outcomeField)

    return fields
  }

  buildPayload(
    appointment: AppointmentDto,
    formData: AppointmentOutcomeForm,
    supervisor: SupervisorDto,
  ): UpdateAppointmentDto {
    let payload: UpdateAppointmentDto

    if (this.action === 'absent') {
      payload = {
        deliusId: appointment.id,
        deliusVersionToUpdate: appointment.version,
        alertActive: GovUkRadioGroup.nullableValueFromYesOrNoItem(this.query.alertPractitioner as YesOrNo),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        contactOutcomeCode: ReferenceDataService.UnacceptableAbsenceOutcomeCode,
        attendanceData: appointment.attendanceData,
        supervisorOfficerCode: supervisor.code,
        notes: formData.notes,
        sensitive: formData.sensitive,
        date: appointment.date,
      }
    } else {
      payload = {
        deliusId: appointment.id,
        deliusVersionToUpdate: formData.deliusVersion,
        startTime: formData.startTime,
        endTime: formData.endTime,
        contactOutcomeCode: formData.contactOutcomeCode,
        attendanceData: {
          ...appointment.attendanceData,
          ...formData.attendanceData,
        },
        supervisorOfficerCode: supervisor.code,
        alertActive: GovUkRadioGroup.nullableValueFromYesOrNoItem(this.query.alertPractitioner as YesOrNo),
        notes: formData.notes,
        sensitive: formData.sensitive,
        date: appointment.date,
      }
    }

    return payload
  }

  protected pathWithFormId(path: string): string {
    return pathWithQuery(path, { form: this.formId })
  }
}
