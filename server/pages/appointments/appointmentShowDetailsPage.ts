import { AppointmentDto } from '../../@types/shared'
import { AppointmentStatusType } from '../../@types/user-defined'
import Offender from '../../models/offender'
import paths from '../../paths'
import AppointmentUtils from '../../utils/appointmentUtils'
import DateTimeFormats from '../../utils/dateTimeUtils'
import StatusTagUtils from '../../utils/GovUKFrontend/statusTagUtils'

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
  statusTagHtml: string
}

export default class AppointmentShowDetailsPage {
  viewData(appointment: AppointmentDto, appointmentStatus: AppointmentStatusType): ViewData {
    return {
      offender: new Offender(appointment.offender),
      startTime: DateTimeFormats.stripTime(appointment.startTime),
      endTime: DateTimeFormats.stripTime(appointment.endTime),
      backPath: paths.sessions.show({ projectCode: appointment.projectCode, date: appointment.date }),
      actions: this.appointmentActions(appointment),
      statusTagHtml: StatusTagUtils.getHtml(appointmentStatus, AppointmentUtils.statusTagColour[appointmentStatus]),
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
