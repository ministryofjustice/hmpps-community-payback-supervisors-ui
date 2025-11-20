import { AppointmentDto } from '../../../../../server/@types/shared'
import Page from '../../../page'
import Offender from '../../../../../server/models/offender'
import paths from '../../../../../server/paths'

export default class ConfirmUnableToWorkPage extends Page {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    const title = `${offender.name} has been recorded as being unable to work`
    super(title)
  }

  static visit(appointment: AppointmentDto): ConfirmUnableToWorkPage {
    const path = paths.appointments.confirm.unableToWork({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new ConfirmUnableToWorkPage(appointment)
  }

  clickLinkToSessionPage(): void {
    cy.get('a').contains('Return to session page').click()
  }
}
