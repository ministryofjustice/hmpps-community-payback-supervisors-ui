import { AppointmentDto } from '../../../../../server/@types/shared'
import Offender from '../../../../../server/models/offender'
import paths from '../../../../../server/paths'
import BaseConfirmPage from './baseConfirmPage'

export default class ConfirmCompletedPage extends BaseConfirmPage {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    const title = `${offender.name} session has been completed`
    super(title)
  }

  static visit(appointment: AppointmentDto): ConfirmCompletedPage {
    const path = paths.appointments.confirm.working({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new ConfirmCompletedPage(appointment)
  }
}
