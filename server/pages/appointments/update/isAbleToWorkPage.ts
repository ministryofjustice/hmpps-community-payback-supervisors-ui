import { AppointmentDto } from '../../../@types/shared'
import { ValidationErrors, YesOrNo } from '../../../@types/user-defined'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'

interface ViewData extends AppointmentUpdatePageViewData {
  title: string
}

interface Query {
  ableToWork?: YesOrNo
}

interface Body {
  ableToWork: YesOrNo
}

export default class IsAbleToWorkPage extends BaseAppointmentUpdatePage<Body> {
  constructor(private readonly query: Query = {}) {
    super()
  }

  nextPath(appointmentId: string, projectCode: string): string {
    if (this.isAbleToWork()) {
      return paths.appointments.confirm.working({ projectCode, appointmentId })
    }
    return paths.appointments.arrived.unableToWork({ projectCode, appointmentId })
  }

  isAbleToWork() {
    return this.query.ableToWork === 'yes'
  }

  protected backPath(appointment: AppointmentDto): string {
    return paths.appointments.arrived.startTime({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })
  }

  protected updatePath(appointment: AppointmentDto): string {
    return paths.appointments.arrived.isAbleToWork({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })
  }

  viewData(appointment: AppointmentDto): ViewData {
    const commonViewData = this.commonViewData(appointment)

    return {
      ...commonViewData,
      title: this.getPageTitle(commonViewData.offender),
    }
  }

  protected getValidationErrors(): ValidationErrors<Body> {
    if (!this.query.ableToWork) {
      return { ableToWork: { text: 'Select whether the person is able to work today' } }
    }

    return {}
  }

  private getPageTitle(offender: Offender): string {
    return `Can ${offender.name} work today?`
  }
}
