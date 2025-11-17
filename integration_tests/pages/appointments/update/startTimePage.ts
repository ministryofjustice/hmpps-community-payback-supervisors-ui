import { AppointmentDto } from '../../../../server/@types/shared'
import Page from '../../page'
import Offender from '../../../../server/models/offender'
import paths from '../../../../server/paths'

export default class StartTimePage extends Page {
  constructor(appointment: AppointmentDto, isArrivedForm: boolean) {
    const offender = new Offender(appointment.offender)
    const title = isArrivedForm
      ? `You are logging ${offender.name} as having arrived at:`
      : `You are logging ${offender.name} as absent:`
    super(title)
  }

  static visit(appointment: AppointmentDto, projectCode: string, isArrivedForm: boolean): StartTimePage {
    const path = paths.appointments.startTime({ appointmentId: appointment.id.toString(), projectCode })
    cy.visit(path)

    return new StartTimePage(appointment, isArrivedForm)
  }
}
