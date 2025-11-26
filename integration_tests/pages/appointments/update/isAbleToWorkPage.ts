import { AppointmentDto } from '../../../../server/@types/shared'
import Page from '../../page'
import Offender from '../../../../server/models/offender'
import paths from '../../../../server/paths'

export default class IsAbleToWorkPage extends Page {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    const title = `Can ${offender.name} work today?`
    super(title)
  }

  static visit(appointment: AppointmentDto): IsAbleToWorkPage {
    const path = paths.appointments.arrived.isAbleToWork({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new IsAbleToWorkPage(appointment)
  }

  selectYes(): void {
    this.checkRadioByNameAndValue('ableToWork', 'yes')
  }

  selectNo(): void {
    this.checkRadioByNameAndValue('ableToWork', 'no')
  }
}
