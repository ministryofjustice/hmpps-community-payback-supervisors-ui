import { AppointmentDto } from '../../../@types/shared'
import { AppointmentOutcomeForm, ValidationErrors, YesOrNo } from '../../../@types/user-defined'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import { pathWithQuery } from '../../../utils/utils'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'

interface ViewData extends AppointmentUpdatePageViewData {
  title: string
  ableToWork: YesOrNo
}

interface Query {
  ableToWork?: YesOrNo
}

interface Body {
  ableToWork: YesOrNo
}

export default class IsAbleToWorkPage extends BaseAppointmentUpdatePage<Body> {
  constructor(
    private readonly formId: string,
    private readonly query: Query = {},
  ) {
    super()
  }

  nextPath(appointmentId: string, projectCode: string): string {
    if (this.isAbleToWork()) {
      return pathWithQuery(paths.appointments.completed.endTime({ projectCode, appointmentId }), {
        form: this.formId,
      })
    }
    return pathWithQuery(paths.appointments.arrived.endTime({ projectCode, appointmentId }), {
      form: this.formId,
    })
  }

  isAbleToWork() {
    return this.query.ableToWork === 'yes'
  }

  protected backPath(appointment: AppointmentDto): string {
    return pathWithQuery(
      paths.appointments.arrived.startTime({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      { form: this.formId },
    )
  }

  protected updatePath(appointment: AppointmentDto): string {
    return pathWithQuery(
      paths.appointments.arrived.isAbleToWork({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      { form: this.formId },
    )
  }

  updatedFormData(formData: AppointmentOutcomeForm): AppointmentOutcomeForm {
    return {
      ...formData,
      ableToWork: this.query.ableToWork,
    }
  }

  viewData(appointment: AppointmentDto, formData?: AppointmentOutcomeForm): ViewData {
    const commonViewData = this.commonViewData(appointment)
    const hasFormBody = this.query.ableToWork !== undefined

    return {
      ...commonViewData,
      title: this.getPageTitle(commonViewData.offender),
      ableToWork: hasFormBody ? this.query.ableToWork : formData?.ableToWork,
    }
  }

  protected getValidationErrors(): ValidationErrors<Body> {
    if (!this.query.ableToWork) {
      return { ableToWork: { text: 'Select yes if they are able to work' } }
    }

    return {}
  }

  private getPageTitle(offender: Offender): string {
    return `Can ${offender.name} work today?`
  }
}
