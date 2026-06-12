import paths from '../../../../server/paths'
import Offender from '../../../../server/models/offender'
import Page from '../../page'
import { AppointmentDto } from '../../../../server/@types/shared'
import { pathWithQuery } from '../../../../server/utils/utils'
import RadioGroupComponent from '../../components/radioGroupComponent'

export default class AttendanceOutcomePage extends Page {
  readonly contactOutcomeOptions: RadioGroupComponent

  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    super(offender.name)
    this.contactOutcomeOptions = new RadioGroupComponent('attendanceOutcome')
  }

  static visit(appointment: AppointmentDto): AttendanceOutcomePage {
    const path = pathWithQuery(
      paths.appointments.attendanceOutcome({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      {
        form: '123',
      },
    )
    cy.visit(path)

    return new AttendanceOutcomePage(appointment)
  }

  completeForm(contactOutcomeCode: string) {
    this.contactOutcomeOptions.checkOptionWithValue(contactOutcomeCode)
  }

  protected customCheckOnPage(): void {
    cy.get('legend').should('contain.text', 'Log attendance')
  }
}
