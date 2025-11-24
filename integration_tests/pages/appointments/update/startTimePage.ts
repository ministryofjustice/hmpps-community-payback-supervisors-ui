import { AppointmentDto } from '../../../../server/@types/shared'
import Page from '../../page'
import Offender from '../../../../server/models/offender'
import paths from '../../../../server/paths'
import { AppointmentArrivedAction } from '../../../../server/@types/user-defined'

export default class StartTimePage extends Page {
  constructor(appointment: AppointmentDto, action: AppointmentArrivedAction) {
    const offender = new Offender(appointment.offender)
    const title: string = StartTimePage.getExpectedTitle(action, offender)
    super(title)
  }

  static visit(appointment: AppointmentDto, action: AppointmentArrivedAction): StartTimePage {
    const path = paths.appointments[action].startTime({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new StartTimePage(appointment, action)
  }

  clearStartTime(): void {
    this.getTextInputById('startTime').clear()
  }

  enterStartTime(value: string): void {
    this.clearStartTime()
    this.getTextInputById('startTime').type(value)
  }

  private static getExpectedTitle(action: string, offender: Offender) {
    let title: string

    if (action === 'arrived') {
      title = `You're logging ${offender.name} as having arrived at:`
    }

    if (action === 'absent') {
      title = `You're logging ${offender.name} as absent today at:`
    }
    return title
  }
}
