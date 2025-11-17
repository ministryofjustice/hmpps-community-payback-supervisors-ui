import { AppointmentDto } from '../../../@types/shared'
import Offender from '../../../models/offender'
import paths from '../../../paths'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'

interface ViewData extends AppointmentUpdatePageViewData {
  startTime: string
  title: string
}

interface Body {
  startTime: string
}

export default class StartTimePage extends BaseAppointmentUpdatePage<Body> {
  nextPath(appointmentId: string, projectCode: string): string {
    return paths.appointments.ableToWork({ projectCode, appointmentId })
  }

  protected backPath(appointment: AppointmentDto, projectCode: string): string {
    return paths.appointments.show({ projectCode, appointmentId: appointment.id.toString() })
  }

  protected updatePath(appointment: AppointmentDto, projectCode: string): string {
    return paths.appointments.startTime({ projectCode, appointmentId: appointment.id.toString() })
  }

  viewData(appointment: AppointmentDto, projectCode: string): ViewData {
    const commonViewData = this.commonViewData(appointment, projectCode)
    return {
      ...commonViewData,
      startTime: appointment.startTime,
      title: this.getPageTitle(commonViewData.offender),
    }
  }

  private getPageTitle(offender: Offender): string {
    return `You are logging ${offender.name} as having arrived at:`
  }
}
