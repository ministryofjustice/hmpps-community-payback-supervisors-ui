import { AppointmentDto } from '../../../../server/@types/shared'
import paths from '../../../../server/paths'
import Offender from '../../../../server/models/offender'
import PageWithNotes from './base/pageWithNotes'

export default class UnableToWorkPage extends PageWithNotes {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    const title = `Why is ${offender.name} unable to work today?`
    super(title, 'Add notes')
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
