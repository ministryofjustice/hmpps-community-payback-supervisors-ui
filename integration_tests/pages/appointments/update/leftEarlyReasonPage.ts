import { AppointmentDto } from '../../../../server/@types/shared'
import paths from '../../../../server/paths'
import Offender from '../../../../server/models/offender'
import { pathWithQuery } from '../../../../server/utils/utils'
import Page from '../../page'

export default class LeftEarlyReasonPage extends Page {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    const title = `Why did ${offender.name} leave early?`
    super(title)
  }

  static visit(appointment: AppointmentDto, formId: string = 'some-form'): LeftEarlyReasonPage {
    const path = pathWithQuery(
      paths.appointments.leftEarly.reason({
        appointmentId: appointment.id.toString(),
        projectCode: appointment.projectCode,
      }),
      { form: formId },
    )
    cy.visit(path)

    return new LeftEarlyReasonPage(appointment)
  }

  selectSentHomeServiceIssues(): void {
    this.getInputByLabel('Attended - Sent Home (service issues)').check()
  }
}
