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
    const action = isArrivedForm ? 'arrived' : 'absent'
    const path = paths.appointments.startTime({ appointmentId: appointment.id.toString(), projectCode, action })
    cy.visit(path)

    return new StartTimePage(appointment, isArrivedForm)
  }

  clearStartTime(): void {
    this.getTextInputById('startTime').clear()
  }

  enterStartTime(value: string): void {
    this.clearStartTime()
    this.getTextInputById('startTime').type(value)
  }
}
