import { AppointmentDto, AttendanceDataDto } from '../../../../server/@types/shared'
import { AppointmentCompletedAction, YesOrNo } from '../../../../server/@types/user-defined'
import paths from '../../../../server/paths'
import GovUkRadioGroup from '../../../../server/utils/GovUKFrontend/GovUkRadioGroup'
import { pathWithQuery } from '../../../../server/utils/utils'
import PageWithNotes from './base/pageWithNotes'

export default class CompliancePage extends PageWithNotes {
  constructor(private readonly appointment: AppointmentDto) {
    super('Log compliance', 'Notes')
  }

  static visit(
    appointment: AppointmentDto,
    action: AppointmentCompletedAction,
    formId: string = 'some-form',
  ): CompliancePage {
    const path = pathWithQuery(
      paths.appointments[action].compliance({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      { form: formId },
    )

    cy.visit(path)

    return new CompliancePage(appointment)
  }

  completeForm(): void {
    this.selectHiVisValue()
    this.selectWorkedIntensivelyValue()
    this.selectWorkQualityValue()
    this.behaviourOption().check()
    this.enterNotes()
    this.checkSensitiveInformation()
  }

  shouldHaveFormWithAppointmentValues() {
    const { attendanceData } = this.appointment
    this.shouldHaveSelectedHiVisValue(GovUkRadioGroup.determineCheckedValue(attendanceData.hiVisWorn))
    this.shouldHaveSelectedWorkedIntensivelyValue(
      GovUkRadioGroup.determineCheckedValue(attendanceData.workedIntensively),
    )
    this.shouldHaveSelectedWorkQualityValue(attendanceData.workQuality)
    this.shouldHaveSelectedBehavourValue(attendanceData.behaviour)
  }

  shouldHaveFormWithEmptyValues() {
    this.hiVisOption('yes').should('not.be.checked')
    this.hiVisOption('no').should('not.be.checked')

    this.workedIntensivelyOption('yes').should('not.be.checked')
    this.workedIntensivelyOption('no').should('not.be.checked')

    this.behaviourOption('EXCELLENT').should('not.be.checked')
    this.behaviourOption('GOOD').should('not.be.checked')
    this.behaviourOption('NOT_APPLICABLE').should('not.be.checked')
    this.behaviourOption('POOR').should('not.be.checked')
    this.behaviourOption('SATISFACTORY').should('not.be.checked')
    this.behaviourOption('UNSATISFACTORY').should('not.be.checked')

    this.workQualityOption('EXCELLENT').should('not.be.checked')
    this.workQualityOption('GOOD').should('not.be.checked')
    this.workQualityOption('NOT_APPLICABLE').should('not.be.checked')
    this.workQualityOption('POOR').should('not.be.checked')
    this.workQualityOption('SATISFACTORY').should('not.be.checked')
    this.workQualityOption('UNSATISFACTORY').should('not.be.checked')

    this.shouldHaveEmptyNotes()
  }

  selectHiVisValue() {
    this.hiVisOption().check()
  }

  shouldHaveSelectedHiVisValue(value: YesOrNo = 'yes') {
    this.hiVisOption(value).should('be.checked')
  }

  selectWorkedIntensivelyValue() {
    this.workedIntensivelyOption().check()
  }

  shouldHaveSelectedWorkedIntensivelyValue(value: YesOrNo = 'yes') {
    this.workedIntensivelyOption(value).check()
  }

  selectWorkQualityValue() {
    this.workQualityOption().check()
  }

  shouldHaveSelectedWorkQualityValue(value: AttendanceDataDto['workQuality'] = 'GOOD') {
    this.workQualityOption(value).should('be.checked')
  }

  shouldHaveSelectedBehavourValue(value: AttendanceDataDto['behaviour'] = 'UNSATISFACTORY') {
    this.behaviourOption(value).should('be.checked')
  }

  enterNotes() {
    this.enterNotesWithCharacterLength(4000)
  }

  shouldHaveEmptyNotes() {
    this.notesField().should('have.value', '')
  }

  checkSensitiveInformation(): void {
    this.getInputByLabel('This information is not to be shared with the person on probation').check()
  }

  private hiVisOption = (value: YesOrNo = 'yes') => this.getRadioByNameAndValue('hiVis', value)

  private workedIntensivelyOption = (value: YesOrNo = 'no') => this.getRadioByNameAndValue('workedIntensively', value)

  private workQualityOption = (value: AttendanceDataDto['workQuality'] = 'GOOD') =>
    this.getRadioByNameAndValue('workQuality', value)

  private behaviourOption = (value: AttendanceDataDto['behaviour'] = 'UNSATISFACTORY') =>
    this.getRadioByNameAndValue('behaviour', value)
}
