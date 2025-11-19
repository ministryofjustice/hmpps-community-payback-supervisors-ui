import { AppointmentDto } from '../../@types/shared'
import Offender from '../../models/offender'
import paths from '../../paths'
import DateTimeFormats from '../../utils/dateTimeUtils'

interface AppointmentActions {
  arrivedPath: string
  absentPath: string
}

interface ViewData {
  offender: Offender
  startTime: string
  endTime: string
  backPath: string
  actions: AppointmentActions
}

export default class AppointmentShowDetailsPage {
  viewData(appointment: AppointmentDto): ViewData {
    return {
      offender: new Offender(appointment.offender),
      startTime: DateTimeFormats.stripTime(appointment.startTime),
      endTime: DateTimeFormats.stripTime(appointment.endTime),
      backPath: paths.sessions.show({ projectCode: appointment.projectCode, date: appointment.date }),
      actions: this.appointmentActions(appointment),
    }
  }

  private appointmentActions(appointment: AppointmentDto): AppointmentActions {
    const appointmentPathParams = { projectCode: appointment.projectCode, appointmentId: appointment.id.toString() }

    return {
      absentPath: paths.appointments.absent.startTime(appointmentPathParams),
      arrivedPath: paths.appointments.arrived.startTime(appointmentPathParams),
    }
  }
}
