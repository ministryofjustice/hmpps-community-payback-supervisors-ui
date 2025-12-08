import { AppointmentDto } from '../../../../server/@types/shared'
import { AppointmentCompletedAction } from '../../../../server/@types/user-defined'
import paths from '../../../../server/paths'
import Page from '../../page'

export default class CompliancePage extends Page {
  constructor() {
    super('Log compliance')
  }

  static visit(
    appointment: AppointmentDto,
    action: AppointmentCompletedAction,
    contactOutcomeCode: string,
  ): CompliancePage {
    const path = paths.appointments[action].compliance({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
      contactOutcomeCode,
    })

    cy.visit(path)

    return new CompliancePage()
  }

  completeForm(): void {
    this.checkRadioByNameAndValue('hiVis', 'yes')
    this.checkRadioByNameAndValue('workedIntensively', 'no')
    this.checkRadioByNameAndValue('workQuality', 'GOOD')
    this.checkRadioByNameAndValue('behaviour', 'UNSATISFACTORY')
    this.getTextInputByIdAndEnterDetails('notes', 'Attendance notes')
  }
}
