import { AppointmentDto } from '../../../../server/@types/shared'
import paths from '../../../../server/paths'
import Offender from '../../../../server/models/offender'
import PageWithNotes from './base/pageWithNotes'

export default class LeftEarlyReasonPage extends PageWithNotes {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    const title = `Why did ${offender.name} leave early?`
    super(title)
  }

  static visit(appointment: AppointmentDto): LeftEarlyReasonPage {
    const path = paths.appointments.leftEarly.reason({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new LeftEarlyReasonPage(appointment)
  }

  selectSentHomeServiceIssues(): void {
    this.getInputByLabel('Attended - Sent Home (service issues)').check()
  }
}
