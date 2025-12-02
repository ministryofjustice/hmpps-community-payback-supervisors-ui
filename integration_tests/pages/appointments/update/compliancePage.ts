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
    this.selectHiVisValue()
    this.selectWorkedIntensivelyValue()
    this.selectWorkQualityValue()
    this.checkedBehaviourOption().check()
    this.enterNotes()
  }

  selectHiVisValue() {
    this.checkedHiVisVisOption().check()
  }

  shouldHaveSelectedHiVisValue() {
    this.checkedHiVisVisOption().should('be.checked')
  }

  selectWorkedIntensivelyValue() {
    this.checkedWorkedIntensivelyOption().check()
  }

  shouldHaveSelectedWorkedIntensivelyValue() {
    this.checkedWorkedIntensivelyOption().check()
  }

  selectWorkQualityValue() {
    this.checkedHiVisOption().check()
  }

  shouldHaveSelectedWorkQualityValue() {
    this.checkedHiVisOption().should('be.checked')
  }

  enterNotes() {
    this.notesField().type('Attendance notes')
  }

  shouldHaveEnteredNotes() {
    this.notesField().should('have.value', 'Attendance notes')
  }

  private checkedHiVisVisOption = () => this.getRadioByNameAndValue('hiVis', 'yes')

  private checkedWorkedIntensivelyOption = () => this.getRadioByNameAndValue('workedIntensively', 'no')

  private checkedHiVisOption = () => this.getRadioByNameAndValue('workQuality', 'GOOD')

  private checkedBehaviourOption = () => this.getRadioByNameAndValue('behaviour', 'UNSATISFACTORY')

  private notesField = () => this.getInputByLabel('Notes')
}
