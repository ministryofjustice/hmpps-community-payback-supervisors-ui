import { AppointmentDto, ContactOutcomeDto } from '../../@types/shared'
import { GovUkSummaryListItem, LinkItem } from '../../@types/user-defined'
import Offender from '../../models/offender'
import paths from '../../paths'
import AppointmentUtils from '../../utils/appointmentUtils'
import DateTimeFormats from '../../utils/dateTimeUtils'
import GovUKComponentUtils from '../../utils/govUkComponentUtils'
import LocationUtils from '../../utils/locationUtils'

interface ViewData {
  offender: Offender
  startTime: string
  endTime: string
  backPath: string
  actions: LinkItem[]
  statusTagHtml: string
  pickupDetails: Array<GovUkSummaryListItem>
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
      statusTagHtml: AppointmentUtils.buildStatusTag(contactOutcome),
      pickupDetails: this.pickupDetails(appointment),
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

  private pickupDetails(appointment: AppointmentDto): Array<GovUkSummaryListItem> {
    const items = [
      {
        label: 'Location',
        content: appointment.pickUpData?.pickupLocation
          ? LocationUtils.locationToString(appointment.pickUpData?.pickupLocation, { withLineBreaks: false })
          : undefined,
      },
      {
        label: 'Time',
        content: appointment.pickUpData?.time ? DateTimeFormats.stripTime(appointment.pickUpData?.time) : undefined,
      },
    ]

    return GovUKComponentUtils.buildSummaryListItems(items, true)
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
