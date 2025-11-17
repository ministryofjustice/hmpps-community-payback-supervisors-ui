import { AppointmentDto } from '../../@types/shared'
import Offender from '../../models/offender'
import paths from '../../paths'
import DateTimeFormats from '../../utils/dateTimeUtils'

interface ViewData {
  offender: Offender
  startTime: string
  endTime: string
  backPath: string
}

export default class AppointmentShowDetailsPage {
  viewData(appointment: AppointmentDto): ViewData {
    return {
      offender: new Offender(appointment.offender),
      startTime: DateTimeFormats.stripTime(appointment.startTime),
      endTime: DateTimeFormats.stripTime(appointment.endTime),
      backPath: paths.sessions.show({ projectCode: appointment.projectCode, date: appointment.date }),
    }
  }
}
