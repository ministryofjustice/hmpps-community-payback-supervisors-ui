import { AppointmentDto } from '../../../@types/shared'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'

interface ViewData extends AppointmentUpdatePageViewData {
  title: string
}

interface Query {
  ableToWork?: string
}

interface Body {
  ableToWork: string
}

export default class AbleToWorkPage extends BaseAppointmentUpdatePage<Body> {
  constructor(private readonly query: Query = {}) {
    super()
  }

  nextPath(appointmentId: string, projectCode: string): string {
    return paths.appointments.confirm.working({ projectCode, appointmentId })
  }

  protected backPath(appointment: AppointmentDto, projectCode: string): string {
    return paths.appointments.arrived.startTime({ projectCode, appointmentId: appointment.id.toString() })
  }

  protected updatePath(appointment: AppointmentDto, projectCode: string): string {
    return paths.appointments.arrived.ableToWork({ projectCode, appointmentId: appointment.id.toString() })
  }

  viewData(appointment: AppointmentDto, projectCode: string): ViewData {
    const commonViewData = this.commonViewData(appointment, projectCode)

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
