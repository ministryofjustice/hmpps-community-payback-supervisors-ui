import { AppointmentDto } from '../../../../server/@types/shared'
import Page from '../../page'
import Offender from '../../../../server/models/offender'
import paths from '../../../../server/paths'

export default class AbleToWorkPage extends Page {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    const title = `Can ${offender.name} work today?`
    super(title)
  }

  static visit(appointment: AppointmentDto): AbleToWorkPage {
    const path = paths.appointments.arrived.ableToWork({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new AbleToWorkPage(appointment)
  }

  selectYes(): void {
    this.checkRadioByNameAndValue('ableToWork', 'yes')
  }
}
