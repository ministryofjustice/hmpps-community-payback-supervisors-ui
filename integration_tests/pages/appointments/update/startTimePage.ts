import { AppointmentDto } from '../../../../server/@types/shared'
import Offender from '../../../../server/models/offender'
import paths from '../../../../server/paths'
import { AppointmentArrivedAction } from '../../../../server/@types/user-defined'
import LogTimePage from './base/logTimePage'

export default class StartTimePage extends LogTimePage {
  constructor(appointment: AppointmentDto, action: AppointmentArrivedAction) {
    const offender = new Offender(appointment.offender)
    const title: string = StartTimePage.getExpectedTitle(action, offender)
    super(title)
  }

  static visit(appointment: AppointmentDto, action: AppointmentArrivedAction): StartTimePage {
    const path = paths.appointments[action].startTime({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new StartTimePage(appointment, action)
  }

  private static getExpectedTitle(action: string, offender: Offender) {
    let title: string

    if (action === 'arrived') {
      title = `You're logging ${offender.name} as having arrived at:`
    }

    if (action === 'absent') {
      title = `You're logging ${offender.name} as absent today at:`
    }
    return title
  }

  shouldShowValidationErrors() {
    this.shouldShowErrorSummary('time', 'Enter a start time')
  }
}
