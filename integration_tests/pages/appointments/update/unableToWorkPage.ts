import { AppointmentDto } from '../../../../server/@types/shared'
import Page from '../../page'
import Offender from '../../../../server/models/offender'
import paths from '../../../../server/paths'

export default class UnableToWorkPage extends Page {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    const title = `Why is ${offender.name} unable to work today?`
    super(title)
  }

  static visit(appointment: AppointmentDto): UnableToWorkPage {
    const path = paths.appointments.arrived.unableToWork({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new UnableToWorkPage(appointment)
  }

  selectSentHomeServiceIssues(): void {
    this.getInputByLabel('Attended - Sent Home (service issues)').check()
  }
}
