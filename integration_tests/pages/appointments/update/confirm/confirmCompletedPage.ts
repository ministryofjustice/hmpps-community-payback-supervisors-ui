import { AppointmentDto } from '../../../../../server/@types/shared'
import Offender from '../../../../../server/models/offender'
import paths from '../../../../../server/paths'
import BaseConfirmPage from './baseConfirmPage'

export default class ConfirmCompletedPage extends BaseConfirmPage {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    const title = `You have recorded the outcome for ${offender.name}`
    super(title)
  }

  static visit(appointment: AppointmentDto): ConfirmCompletedPage {
    const path = paths.appointments.confirm.completed({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })
    cy.visit(path)

    return new ConfirmCompletedPage(appointment)
  }
}
