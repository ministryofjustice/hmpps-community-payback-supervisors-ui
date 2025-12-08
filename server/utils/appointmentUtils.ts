import { AppointmentStatusType, GovUkStatusTagColour } from '../@types/user-defined'

export default class AppointmentUtils {
  static getStatusTagViewData(status: AppointmentStatusType) {
    return {
      text: status,
      classes: `govuk-tag--${AppointmentUtils.statusTagColour[status]}`,
    }
  }

  static statusTagColour: Record<AppointmentStatusType, GovUkStatusTagColour> = {
    Absent: 'yellow',
    Scheduled: 'grey',
    Working: 'green',
    'Session complete': 'blue',
    'Not expected': 'red',
    'Cannot work': 'purple',
    'Left site': 'orange',
  }

  static isSessionComplete(status: AppointmentStatusType): boolean {
    const sessionCompleteStatuses: AppointmentStatusType[] = ['Absent', 'Cannot work', 'Session complete']
    return sessionCompleteStatuses.includes(status)
  }
}
