import { AppointmentDto } from '../../../../server/@types/shared'
import Page from '../../page'
import paths from '../../../../server/paths'

export default class UnableToWorkPage extends Page {
  private userInput: string

  constructor() {
    super('Unable to work')
  }

  static visit(appointment: AppointmentDto): UnableToWorkPage {
    const path = paths.appointments.arrived.unableToWork({
      appointmentId: appointment.id.toString(),
      projectCode: appointment.projectCode,
    })
    cy.visit(path)

    return new UnableToWorkPage()
  }

  selectSentHomeServiceIssues(): void {
    this.getInputByLabel('Attended - Sent Home (service issues)').check()
  }

  enterNotesWithCharacterLength(characterLength: number): void {
    this.userInput = 'x'.repeat(characterLength)

    // Use 'invoke' instead of 'type' for performance reasons
    this.getInputByLabel('Add notes').invoke('val', this.userInput)
  }

  shouldShowSubmittedNotes(): void {
    this.getInputByLabel('Add notes').should('have.value', this.userInput)
  }

  checkSensitiveInformation(): void {
    this.getInputByLabel('This information is not to be shared with the person on probation').check()
  }
}
