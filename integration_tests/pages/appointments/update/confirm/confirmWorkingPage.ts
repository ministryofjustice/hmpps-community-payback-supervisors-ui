import { AppointmentDto } from '../../../../../server/@types/shared'
import Offender from '../../../../../server/models/offender'
import paths from '../../../../../server/paths'
import BaseConfirmPage from './baseConfirmPage'

export default class ConfirmWorkingPage extends BaseConfirmPage {
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
}
