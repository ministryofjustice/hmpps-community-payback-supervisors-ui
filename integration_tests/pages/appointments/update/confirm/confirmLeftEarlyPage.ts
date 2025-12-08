import { AppointmentDto } from '../../../../../server/@types/shared'
import Offender from '../../../../../server/models/offender'
import paths from '../../../../../server/paths'
import BaseConfirmPage from './baseConfirmPage'

export default class ConfirmLeftEarlyPage extends BaseConfirmPage {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    const title = `${offender.name} has been recorded as leaving the site early`
    super(title)
  }

  static visit(appointment: AppointmentDto): ConfirmLeftEarlyPage {
    const path = paths.appointments.confirm.leftEarly({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new ConfirmLeftEarlyPage(appointment)
  }
}
