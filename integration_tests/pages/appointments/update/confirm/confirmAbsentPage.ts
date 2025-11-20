import { AppointmentDto } from '../../../../../server/@types/shared'
import Offender from '../../../../../server/models/offender'
import paths from '../../../../../server/paths'
import BaseConfirmPage from './baseConfirmPage'

export default class ConfirmAbsentPage extends BaseConfirmPage {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    const title = `${offender.name} has been recorded as absent`
    super(title)
  }

  static visit(appointment: AppointmentDto): ConfirmAbsentPage {
    const path = paths.appointments.confirm.absent({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new ConfirmAbsentPage(appointment)
  }
}
