import { AppointmentDto, ContactOutcomeDto } from '../../../@types/shared'
import { AppointmentOutcomeForm } from '../../../@types/user-defined'
import paths from '../../../paths'
import { pathWithQuery, properCase } from '../../../utils/utils'
import ReviewPage, { ReviewItem, ReviewQuery } from './reviewPage'

export default class ComplianceReviewPage extends ReviewPage {
  private startTimeBackPath: string

  private endTimeBackPath: string

  private notesUrl: string

  private formId: string

  constructor(
    private appointment: AppointmentDto,
    protected query: ReviewQuery,
    private contactOutcome: ContactOutcomeDto,
    private formData: AppointmentOutcomeForm,
  ) {
    super('compliance', query, contactOutcome, {})

    this.formId = this.query.form

    const path = paths.appointments.completed

    this.startTimeBackPath = pathWithQuery(
      paths.appointments.arrived.startTime({
        projectCode: this.appointment.projectCode,
        appointmentId: this.appointment.id.toString(),
      }),
      { form: this.formId },
    )

    this.endTimeBackPath = pathWithQuery(
      path.endTime({
        projectCode: this.appointment.projectCode,
        appointmentId: this.appointment.id.toString(),
      }),
      { form: this.formId },
    )

    this.changeUrl = pathWithQuery(
      path.compliance({
        projectCode: this.appointment.projectCode,
        appointmentId: this.appointment.id.toString(),
      }),
      { form: this.formId },
    )

    this.notesUrl = pathWithQuery(
      paths.appointments.notes.completed({
        projectCode: this.appointment.projectCode,
        appointmentId: this.appointment.id.toString(),
      }),
      { form: this.formId },
    )

    this.showWillAlertPractitionerMessage = this.contactOutcome?.willAlertEnforcementDiary
  }

  protected updatePath(appointment: AppointmentDto): string {
    return pathWithQuery(
      paths.appointments.notes.completed({
        appointmentId: appointment.id.toString(),
        projectCode: appointment.projectCode,
      }),
      {
        form: this.formId,
      },
    )
  }

  protected mappedReviewFields(): ReviewItem {
    // Not_applicable -> Not applicable
    const fmtLabel = (str: string) => properCase(str).replace(/_/, ' ')

    return {
      'Start time': { value: this.formData?.startTime, changeUrl: this.startTimeBackPath },
      'End time': { value: this.formData?.endTime, changeUrl: this.endTimeBackPath },
      'Hi-vis': this.formData?.attendanceData.hiVisWorn ? 'Yes' : 'No',
      'Worked intensively': this.formData?.attendanceData.workedIntensively ? 'Yes' : 'No',
      'Work quality': fmtLabel(this.formData?.attendanceData.workQuality),
      Behaviour: fmtLabel(this.formData?.attendanceData.behaviour),
      Notes: { value: this.formData.notes, changeUrl: this.notesUrl },
      Sensitivity: {
        value: this.formData.sensitive
          ? 'Cannot be shared with person on probation'
          : 'Can be shared with person on probation',
        changeUrl: this.notesUrl,
      },
    }
  }
}
