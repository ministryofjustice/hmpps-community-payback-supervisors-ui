import { AppointmentDto } from '../../../../server/@types/shared'
import paths from '../../../../server/paths'
import Page from '../../page'

export default class ReviewPage extends Page {
  constructor() {
    super('Check your answers')
  }

  // Currently the only GET route (ie. `cy.visit`able) for this page
  // is for the absent journey, so this method for now only handles
  // that.  When further Review Page journeys begin to be reachable via
  // GET, this method will need revisiting (probably with an `action`
  // param and some branching logic for `path`).
  static visit(appointment: AppointmentDto): ReviewPage {
    const path = paths.appointments.review.absent({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })

    cy.visit(path)

    return new ReviewPage()
  }
}
