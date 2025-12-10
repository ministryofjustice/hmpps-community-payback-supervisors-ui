import { AppointmentDto, AttendanceDataDto } from '../../../../server/@types/shared'
import { AppointmentCompletedAction, YesOrNo } from '../../../../server/@types/user-defined'
import paths from '../../../../server/paths'
import Page from '../../page'
import GovUkRadioGroup from '../../../../server/utils/GovUKFrontend/GovUkRadioGroup'

export default class CompliancePage extends Page {
  constructor(private readonly appointment: AppointmentDto) {
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

    return new CompliancePage(appointment)
  }

  completeForm(): void {
    this.selectHiVisValue()
    this.selectWorkedIntensivelyValue()
    this.selectWorkQualityValue()
    this.behaviourOption().check()
    this.enterNotes()
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
    this.notesField().type('Attendance notes')
  }

  shouldHaveEnteredNotes() {
    this.notesField().should('have.value', 'Attendance notes')
  }

  shouldHaveEmptyNotes() {
    this.notesField().should('have.value', '')
  }

  private hiVisOption = (value: YesOrNo = 'yes') => this.getRadioByNameAndValue('hiVis', value)

  private workedIntensivelyOption = (value: YesOrNo = 'no') => this.getRadioByNameAndValue('workedIntensively', value)

  private workQualityOption = (value: AttendanceDataDto['workQuality'] = 'GOOD') =>
    this.getRadioByNameAndValue('workQuality', value)

  private behaviourOption = (value: AttendanceDataDto['behaviour'] = 'UNSATISFACTORY') =>
    this.getRadioByNameAndValue('behaviour', value)

  private notesField = () => this.getInputByLabel('Notes')
}
