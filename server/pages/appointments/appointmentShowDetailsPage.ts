import { ParsedQs } from 'qs'
import { AppointmentDto } from '../../@types/shared'
import { AppointmentStatusType, LinkItem, ValidationErrors } from '../../@types/user-defined'
import Offender from '../../models/offender'
import paths from '../../paths'
import AppointmentUtils from '../../utils/appointmentUtils'
import DateTimeFormats from '../../utils/dateTimeUtils'
import StatusTagUtils from '../../utils/GovUKFrontend/statusTagUtils'
import generateErrorSummary from '../../utils/errorUtils'

interface ViewData {
  offender: Offender
  startTime: string
  endTime: string
  backPath: string
  actions: LinkItem[]
  statusTagHtml: string
  errorSummary?: ValidationErrors<object>
}

export default class AppointmentShowDetailsPage {
  validationErrors: ValidationErrors<object> = {}

  hasErrors: boolean = false

  constructor(private readonly query?: ParsedQs) {
    if (query?.errors === 'invalid-outcome-code') {
      this.validationErrors = { '': { text: 'Invalid outcome code' } }
      this.hasErrors = true
    }
  }

  viewData(appointment: AppointmentDto, appointmentStatus: AppointmentStatusType): ViewData {
    const data = {
      offender: new Offender(appointment.offender),
      startTime: DateTimeFormats.stripTime(appointment.startTime),
      endTime: DateTimeFormats.stripTime(appointment.endTime),
      backPath: paths.sessions.show({ projectCode: appointment.projectCode, date: appointment.date }),
      actions: this.appointmentActions(appointment, appointmentStatus),
      statusTagHtml: StatusTagUtils.getHtml(appointmentStatus, AppointmentUtils.statusTagColour[appointmentStatus]),
    } as ViewData

    if (this.hasErrors) {
      return { ...data, errorSummary: generateErrorSummary(this.validationErrors) }
    }

    return data
  }

  private appointmentActions(appointment: AppointmentDto, appointmentStatus: AppointmentStatusType): LinkItem[] {
    const appointmentPathParams = { projectCode: appointment.projectCode, appointmentId: appointment.id.toString() }

    if (AppointmentUtils.isSessionComplete(appointmentStatus)) {
      return []
    }

    if (appointmentStatus === 'Working') {
      return [
        { text: 'Finish session', href: paths.appointments.completed.endTime(appointmentPathParams) },
        { text: 'Left site early', href: paths.appointments.leftEarly.endTime(appointmentPathParams) },
      ]
    }

    return [
      { text: 'Arrived', href: paths.appointments.arrived.startTime(appointmentPathParams) },
      { text: 'Not arrived', href: paths.appointments.absent.startTime(appointmentPathParams) },
    ]
  }
}
