import { AppointmentDto } from '../../../@types/shared'
import Offender from '../../../models/offender'

export interface AppointmentUpdatePageViewData {
  backPath: string
  offender: Offender
  updatePath: string
  form?: string
}

export default abstract class BaseAppointmentUpdatePage {
  abstract nextPath(appointmentId: string | AppointmentDto, projectCode: string): string

  protected abstract backPath(appointment: AppointmentDto, projectCode: string): string

  protected abstract updatePath(appointment: AppointmentDto, projectCode: string): string

  protected commonViewData(appointment: AppointmentDto, projectCode: string): AppointmentUpdatePageViewData {
    return {
      offender: new Offender(appointment.offender),
      backPath: this.backPath(appointment, projectCode),
      updatePath: this.updatePath(appointment, projectCode),
    }
  }
}
