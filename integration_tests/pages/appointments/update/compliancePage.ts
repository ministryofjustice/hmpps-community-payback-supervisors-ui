import { AppointmentDto, AttendanceDataDto } from '../../../../server/@types/shared'
import { AppointmentCompletedAction } from '../../../../server/@types/user-defined'
import paths from '../../../../server/paths'
import { pathWithQuery } from '../../../../server/utils/utils'
import Page from '../../page'

export default class CompliancePage extends Page {
  constructor(private readonly appointment: AppointmentDto) {
    super('Log compliance')
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
    this.selectWorkQualityValue()
    this.behaviourOption().check()
  }

  shouldHaveFormWithAppointmentValues() {
    const { attendanceData } = this.appointment
    this.shouldHaveSelectedWorkQualityValue(attendanceData.workQuality)
    this.shouldHaveSelectedBehavourValue(attendanceData.behaviour)
  }

  shouldHaveFormWithEmptyValues() {
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

  private workQualityOption = (value: AttendanceDataDto['workQuality'] = 'GOOD') =>
    this.getRadioByNameAndValue('workQuality', value)

  private behaviourOption = (value: AttendanceDataDto['behaviour'] = 'UNSATISFACTORY') =>
    this.getRadioByNameAndValue('behaviour', value)
}
