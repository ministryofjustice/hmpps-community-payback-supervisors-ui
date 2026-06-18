import { AppointmentDto } from '../../../../server/@types/shared'
import { AppointmentNotesAction } from '../../../../server/@types/user-defined'
import paths from '../../../../server/paths'
import Page from '../../page'

export default class ReviewPage extends Page {
  constructor() {
    super('Check your answers')
  }

  static visit(appointment: AppointmentDto, action: AppointmentNotesAction): ReviewPage {
    const path = paths.appointments.review[action]({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })

    cy.visit(path)

    return new ReviewPage()
  }

  shouldShowAlertPractitionerMessage() {
    cy.get('div')
      .contains('This outcome will be shared with the practitioner as it requires enforcement action.')
      .should('be.visible')
  }

  shouldNotShowAlertPractitionerMessage() {
    cy.get('div')
      .contains('This outcome will be shared with the practitioner as it requires enforcement action.')
      .should('not.exist')
  }
}
