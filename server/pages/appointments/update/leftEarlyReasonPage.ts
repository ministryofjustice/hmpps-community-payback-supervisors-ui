import { AppointmentDto, ContactOutcomeDto, UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import { GovUkRadioOption, ValidationErrors } from '../../../@types/user-defined'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import { pathWithQuery } from '../../../utils/utils'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'

interface ViewData extends AppointmentUpdatePageViewData {
  title: string
  items: GovUkRadioOption[]
  notes?: string
  isSensitive?: boolean
}

interface Query {
  leftEarlyReason?: string
  notes?: string
  isSensitive?: string
}

interface Body {
  leftEarlyReason: string
  notes?: string
  isSensitive?: string
}

export default class LeftEarlyReasonPage extends BaseAppointmentUpdatePage<Body> {
  constructor(
    private readonly formId: string,
    private readonly query: Query = {},
  ) {
    super()
  }

  nextPath(appointmentId: string, projectCode: string): string {
    return pathWithQuery(
      paths.appointments.leftEarly.compliance({
        projectCode,
        appointmentId,
        contactOutcomeCode: this.query.leftEarlyReason,
      }),
      { form: this.formId },
    )
  }

  protected backPath(appointment: AppointmentDto): string {
    return pathWithQuery(
      paths.appointments.leftEarly.endTime({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      { form: this.formId },
    )
  }

  protected updatePath(appointment: AppointmentDto): string {
    return pathWithQuery(
      paths.appointments.leftEarly.reason({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      { form: this.formId },
    )
  }

  viewData(appointment: AppointmentDto, contactOutcomes: ContactOutcomeDto[]): ViewData {
    const commonViewData = this.commonViewData(appointment)

    return {
      ...commonViewData,
      title: this.getPageTitle(commonViewData.offender),
      items: this.items(contactOutcomes),
      notes: this.query.notes || null,
      isSensitive: Boolean(this.query.isSensitive),
    }
  }

  protected getValidationErrors(): ValidationErrors<Body> {
    const errors: ValidationErrors<Body> = {}
    if (!this.query.leftEarlyReason) {
      errors.leftEarlyReason = { text: 'Select why they cannot continue this session' }
    }

    if (this.query.notes && this.query.notes.length > 4000) {
      errors.notes = { text: 'Notes must be 4000 characters or less' }
    }

    return errors
  }

  requestBody(appointment: AppointmentDto): UpdateAppointmentOutcomeDto {
    const body: UpdateAppointmentOutcomeDto = {
      ...this.appointmentRequestBody(appointment),
      contactOutcomeCode: this.query.leftEarlyReason,
      notes: this.query.notes || null,
    }

    if (this.query.isSensitive) {
      body.sensitive = true
    }

    return body
  }

  private getPageTitle(offender: Offender): string {
    return `Why did ${offender.name} leave early?`
  }

  private items(contactOutcomes: ContactOutcomeDto[]): { text: string; value: string }[] {
    return contactOutcomes.map(outcome => ({
      text: outcome.name,
      value: outcome.code,
      checked: this.query.leftEarlyReason === outcome.code,
    }))
  }
}
