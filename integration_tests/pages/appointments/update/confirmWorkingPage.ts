import { AppointmentDto } from '../../../../server/@types/shared'
import Page from '../../page'
import Offender from '../../../../server/models/offender'
import paths from '../../../../server/paths'

export default class ConfirmWorkingPage extends Page {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    const title = `${offender.name} has been recorded as starting work today`
    super(title)
  }

  static visit(appointment: AppointmentDto): ConfirmWorkingPage {
    const path = paths.appointments.confirm.working({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new ConfirmWorkingPage(appointment)
  }

  clickLinkToSessionPage(): void {
    cy.get('a').contains('Return to session page').click()
  }
}
