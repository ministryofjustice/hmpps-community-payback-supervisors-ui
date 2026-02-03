import { AppointmentDto, ContactOutcomeDto, UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import { AppointmentOutcomeForm, GovUkRadioOption, ValidationErrors } from '../../../@types/user-defined'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import { pathWithQuery } from '../../../utils/utils'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'

interface ViewData extends AppointmentUpdatePageViewData {
  title: string
  items: GovUkRadioOption[]
}

interface Query {
  leftEarlyReason?: string
}

interface Body {
  leftEarlyReason: string
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

  viewData(
    appointment: AppointmentDto,
    contactOutcomes: ContactOutcomeDto[],
    formData: AppointmentOutcomeForm,
  ): ViewData {
    const commonViewData = this.commonViewData(appointment)

    return {
      ...commonViewData,
      title: this.getPageTitle(commonViewData.offender),
      items: this.items(contactOutcomes, formData),
    }
  }

  updatedFormData(formData: AppointmentOutcomeForm): AppointmentOutcomeForm {
    return {
      ...formData,
      contactOutcomeCode: this.query.leftEarlyReason,
    }
  }

  protected getValidationErrors(): ValidationErrors<Body> {
    const errors: ValidationErrors<Body> = {}
    if (!this.query.leftEarlyReason) {
      errors.leftEarlyReason = { text: 'Select why they cannot continue this session' }
    }

    return errors
  }

  requestBody(appointment: AppointmentDto): UpdateAppointmentOutcomeDto {
    return {
      ...this.appointmentRequestBody(appointment),
      contactOutcomeCode: this.query.leftEarlyReason,
    }
  }

  private getPageTitle(offender: Offender): string {
    return `Why did ${offender.name} leave early?`
  }

  private items(
    contactOutcomes: ContactOutcomeDto[],
    formData: AppointmentOutcomeForm,
  ): { text: string; value: string }[] {
    const code = this.query.leftEarlyReason ?? formData.contactOutcomeCode
    return contactOutcomes.map(outcome => ({
      text: outcome.name,
      value: outcome.code,
      checked: code === outcome.code,
    }))
  }
}
