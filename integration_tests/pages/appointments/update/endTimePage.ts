import { AppointmentDto } from '../../../../server/@types/shared'
import paths from '../../../../server/paths'
import { AppointmentEndTimeAction } from '../../../../server/@types/user-defined'
import LogTimePage from './base/logTimePage'

export default class EndTimePage extends LogTimePage {
  constructor() {
    const title: string = 'Log end time'
    super(title)
  }

  static visit(appointment: AppointmentDto, action: AppointmentEndTimeAction): EndTimePage {
    let path: string
    if (action === 'arrived') {
      path = paths.appointments.arrived.endTime({
        appointmentId: appointment.id.toString(),
        projectCode: appointment.projectCode,
      })
    } else {
      path = paths.appointments[action].endTime({
        appointmentId: appointment.id.toString(),
        projectCode: appointment.projectCode,
      })
    }
    cy.visit(path)

    return new EndTimePage()
  }

  shouldShowValidationErrors() {
    this.shouldShowErrorSummary('time', 'Enter the time they left')
  }

  shouldShowStartTimeValidationErrors() {
    this.shouldShowErrorSummary('time', 'End time must be after 09:00')
  }
}
