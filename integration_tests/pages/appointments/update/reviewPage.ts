import { AppointmentDto } from '../../../../server/@types/shared'
import { AppointmentNotesAction } from '../../../../server/@types/user-defined'
import paths from '../../../../server/paths'
import RadioGroupComponent from '../../components/radioGroupComponent'
import SummaryListComponent from '../../components/summaryListComponent'
import Page from '../../page'

export default class ReviewPage extends Page {
  readonly alertPractitionerQuestion: RadioGroupComponent

  private readonly answers: SummaryListComponent

  constructor() {
    super('Check your answers')

    this.alertPractitionerQuestion = new RadioGroupComponent('alertPractitioner')
    this.answers = new SummaryListComponent()
  }

  checkOnPage(): void {
    cy.get('h2').should('contain.text', this.title)
  }

  static visit(appointment: AppointmentDto, action: AppointmentNotesAction): ReviewPage {
    const path = paths.appointments.review[action]({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })

    cy.visit(path)

    return new ReviewPage()
  }

  shouldShowAlertPractitionerMessage() {
    cy.get('div')
      .contains('This outcome will be shared with the practitioner as it requires enforcement action.')
      .should('be.visible')
  }

  shouldNotShowAlertPractitionerMessage() {
    cy.get('div')
      .contains('This outcome will be shared with the practitioner as it requires enforcement action.')
      .should('not.exist')
  }

  shouldContainNote(note: string) {
    this.answers.getValueWithLabel('Notes').should('contain.text', note)
  }

  canBeShared() {
    this.answers.getValueWithLabel('Notes').should('contain.text', 'No')
  }

  cannotBeShared() {
    this.answers.getValueWithLabel('Sensitive').should('contain.text', 'Yes')
  }

  clickChangeOutcome(text = 'Change'): void {
    this.answers.getActionsWithLabel('Outcome').contains(text).click()
  }

  shouldShowCorrectOutcome(outcome: string) {
    this.answers.getValueWithLabel('Outcome').contains(outcome)
  }

  shouldShowAlertPractitionerError() {
    this.shouldShowErrorSummary('alertPractitioner', 'Choose whether you want to send an alert')
  }

  shouldShowAPIError(errorMessage: string) {
    cy.get('[data-testid="error-summary"]').should('contain', errorMessage)
  }
}
