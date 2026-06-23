import { AppointmentDto, ContactOutcomeDto } from '../../@types/shared'
import { LinkItem } from '../../@types/user-defined'
import Offender from '../../models/offender'
import paths from '../../paths'
import DateTimeFormats from '../../utils/dateTimeUtils'

interface ViewData {
  offender: Offender
  startTime: string
  endTime: string
  backPath: string
  actions: LinkItem[]
  statusTagHtml: string
  canBeUpdated: boolean
}

export default class AppointmentShowDetailsPage {
  viewData(appointment: AppointmentDto, contactOutcome: ContactOutcomeDto): ViewData {
    return {
      offender: new Offender(appointment.offender),
      startTime: DateTimeFormats.stripTime(appointment.startTime),
      endTime: DateTimeFormats.stripTime(appointment.endTime),
      backPath: paths.sessions.show({ projectCode: appointment.projectCode, date: appointment.date }),
      actions: this.appointmentActions(appointment),
      statusTagHtml: contactOutcome ? contactOutcome.name : 'Scheduled',
      canBeUpdated: this.appointmentIsInThePast(appointment),
    }
  }

  private appointmentActions(appointment: AppointmentDto): LinkItem[] {
    const appointmentPathParams = { projectCode: appointment.projectCode, appointmentId: appointment.id.toString() }

    if (appointment.contactOutcomeCode) {
      return []
    }

    return [
      { text: 'Arrived', href: paths.appointments.attendanceOutcome(appointmentPathParams) },
      { text: 'Not arrived', href: paths.appointments.notes.absent(appointmentPathParams) },
    ]
  }

  private appointmentIsInThePast(appointment: AppointmentDto): boolean {
    const baseDate = new Date(appointment.date)

    const [hours, minutes] = appointment.startTime.split(':').map(Number)

    const appointmentDateTime = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hours,
      minutes,
    )

    return Date.now() > appointmentDateTime.getTime()
  }
}
