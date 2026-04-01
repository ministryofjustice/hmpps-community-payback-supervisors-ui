import { AppointmentDto } from '../../../../server/@types/shared'
import Page from '../../page'
import Offender from '../../../../server/models/offender'
import paths from '../../../../server/paths'
import { pathWithQuery } from '../../../../server/utils/utils'

export default class IsAbleToWorkPage extends Page {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    const title = `Can ${offender.name} work today?`
    super(title)
  }

  static visit(appointment: AppointmentDto, formId: string = 'some-form'): IsAbleToWorkPage {
    const path = pathWithQuery(
      paths.appointments.arrived.isAbleToWork({
        appointmentId: appointment.id.toString(),
        projectCode: appointment.projectCode,
      }),
      { form: formId },
    )
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
