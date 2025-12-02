import { AppointmentDto } from '../../../../server/@types/shared'
import Offender from '../../../../server/models/offender'
import paths from '../../../../server/paths'
import { AppointmentCompletedAction } from '../../../../server/@types/user-defined'
import LogTimePage from './base/logTimePage'

export default class EndTimePage extends LogTimePage {
  constructor(appointment: AppointmentDto, action: AppointmentCompletedAction) {
    const offender = new Offender(appointment.offender)
    const title: string = EndTimePage.getExpectedTitle(action, offender)
    super(title)
  }

  static visit(appointment: AppointmentDto, action: AppointmentCompletedAction): EndTimePage {
    const path = paths.appointments[action].endTime({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new EndTimePage(appointment, action)
  }

  private static getExpectedTitle(action: AppointmentCompletedAction, offender: Offender) {
    let title: string

    if (action === 'completed') {
      title = `You're logging ${offender.name} as finishing today at:`
    }

    if (action === 'leftEarly') {
      title = `You're logging ${offender.name} as absent today at:`
    }
    return title
  }

  shouldShowValidationErrors() {
    this.shouldShowErrorSummary('time', 'Enter a finish time')
  }

  shouldShowStartTimeValidationErrors() {
    this.shouldShowErrorSummary('time', 'Finish time must be after 09:00 when they started the session')
  }
}
