import { AppointmentDto, ContactOutcomeDto, ContactOutcomesDto } from '../../../@types/shared'
import { AppointmentOutcomeForm } from '../../../@types/user-defined'
import paths from '../../../paths'
import { pathWithQuery, properCase } from '../../../utils/utils'
import { NotesQuery } from './notesPage'
import ReviewPage, { ReviewItem } from './reviewPage'

export default class ComplianceReviewPage extends ReviewPage {
  private startTimeBackPath: string

  private endTimeBackPath: string

  private notesUrl: string

  constructor(
    private appointment: AppointmentDto,
    private contactOutcomes: ContactOutcomesDto,
    private formId: string,
    private formData: AppointmentOutcomeForm,
    private reqBody: NotesQuery,
  ) {
    super('compliance', 'Session complete', {})

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

    this.showWillAlertPractitionerMessage = this.contactOutcome?.enforceable ?? false
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
      Notes: { value: this.reqBody.notes, changeUrl: this.notesUrl },
      Sensitivity: {
        value: this.reqBody.isSensitive
          ? 'Cannot be shared with person on probation'
          : 'Can be shared with person on probation',
        changeUrl: this.notesUrl,
      },
    }
  }

  private get contactOutcome(): ContactOutcomeDto {
    return this.contactOutcomes.contactOutcomes.find(outcome => {
      return outcome.code === this.formData.contactOutcomeCode
    })
  }
}
