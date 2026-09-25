import { AppointmentDto } from '../../../../server/@types/shared'
import paths from '../../../../server/paths'
import { AppointmentArrivedAction } from '../../../../server/@types/user-defined'
import LogTimePage from './base/logTimePage'

export default class StartTimePage extends LogTimePage {
  constructor() {
    const title: string = StartTimePage.getExpectedTitle()
    super(title)
  }

  static visit(appointment: AppointmentDto, action: AppointmentArrivedAction): StartTimePage {
    const path = paths.appointments[action].startTime({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new StartTimePage()
  }

  private static getExpectedTitle() {
    const title: string = 'Log start time'
    return title
  }

  shouldShowValidationErrors() {
    this.shouldShowErrorSummary('time', 'Enter a start time')
  }
}
