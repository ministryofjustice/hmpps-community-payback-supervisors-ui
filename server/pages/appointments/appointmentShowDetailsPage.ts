import { AppointmentDto } from '../../@types/shared'
import { AppointmentStatusType, LinkItem } from '../../@types/user-defined'
import Offender from '../../models/offender'
import paths from '../../paths'
import AppointmentUtils from '../../utils/appointmentUtils'
import DateTimeFormats from '../../utils/dateTimeUtils'
import StatusTagUtils from '../../utils/GovUKFrontend/statusTagUtils'

interface ViewData {
  offender: Offender
  startTime: string
  endTime: string
  backPath: string
  actions: LinkItem[]
  statusTagHtml: string
}

export default class AppointmentShowDetailsPage {
  viewData(appointment: AppointmentDto, appointmentStatus: AppointmentStatusType): ViewData {
    return {
      offender: new Offender(appointment.offender),
      startTime: DateTimeFormats.stripTime(appointment.startTime),
      endTime: DateTimeFormats.stripTime(appointment.endTime),
      backPath: paths.sessions.show({ projectCode: appointment.projectCode, date: appointment.date }),
      actions: this.appointmentActions(appointment, appointmentStatus),
      statusTagHtml: StatusTagUtils.getHtml(appointmentStatus, AppointmentUtils.statusTagColour[appointmentStatus]),
    }
  }

  private appointmentActions(appointment: AppointmentDto, appointmentStatus: AppointmentStatusType): LinkItem[] {
    const appointmentPathParams = { projectCode: appointment.projectCode, appointmentId: appointment.id.toString() }

    if (appointmentStatus === 'Session complete' || appointmentStatus === 'Absent') {
      return []
    }
    if (appointmentStatus === 'Working') {
      return [{ text: 'Finish session', href: paths.appointments.completed.endTime(appointmentPathParams) }]
    }

    return [
      { text: 'Arrived', href: paths.appointments.arrived.startTime(appointmentPathParams) },
      { text: 'Not arrived', href: paths.appointments.absent.startTime(appointmentPathParams) },
    ]
  }
}
