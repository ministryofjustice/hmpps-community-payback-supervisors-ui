import { AppointmentDto } from '../../../@types/shared'
import paths from '../../../paths'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'

interface ViewData extends AppointmentUpdatePageViewData {
  startTime: string
}

export default class StartTimePage extends BaseAppointmentUpdatePage {
  nextPath(appointmentId: string, projectCode: string): string {
    return paths.appointments.ableToWork({ projectCode, appointmentId })
  }

  protected backPath(appointment: AppointmentDto, projectCode: string): string {
    return paths.appointments.personDetails({ projectCode, appointmentId: appointment.id.toString() })
  }

  protected updatePath(appointment: AppointmentDto, projectCode: string): string {
    return paths.appointments.startTime({ projectCode, appointmentId: appointment.id.toString() })
  }

  viewData(appointment: AppointmentDto, projectCode: string): ViewData {
    return {
      ...this.commonViewData(appointment, projectCode),
      startTime: appointment.startTime,
    }
  }
}
