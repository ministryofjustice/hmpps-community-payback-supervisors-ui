import { AppointmentDto } from '../../../@types/shared'
import { YesOrNo } from '../../../@types/user-defined'
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
    if (this.query.ableToWork === 'yes') {
      return paths.appointments.confirm.working({ projectCode, appointmentId })
    }
    return paths.appointments.arrived.unableToWork({ projectCode, appointmentId })
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

  validate(): void {
    if (!this.query.ableToWork) {
      this.validationErrors.ableToWork = { text: 'Select whether the person is able to work today' }
    }

    this.checkHasErrors()
  }

  private getPageTitle(offender: Offender): string {
    return `Can ${offender.name} work today?`
  }
}
