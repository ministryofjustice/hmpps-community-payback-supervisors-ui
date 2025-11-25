import { AppointmentStatusType, GovUkStatusTagColour } from '../@types/user-defined'

export default class AppointmentUtils {
  static getStatusTagViewData(status: AppointmentStatusType) {
    return {
      text: status,
      classes: `govuk-tag--${AppointmentUtils.statusTagColour[status]}`,
    }
  }

  static statusTagColour: Record<AppointmentStatusType, GovUkStatusTagColour> = {
    Scheduled: 'grey',
    Working: 'green',
    Completed: 'blue',
  }
}
