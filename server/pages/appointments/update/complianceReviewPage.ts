import { AppointmentDto, ContactOutcomesDto } from '../../../@types/shared'
import { AppointmentCompletedAction, AppointmentOutcomeForm } from '../../../@types/user-defined'
import paths from '../../../paths'
import { pathWithQuery, properCase } from '../../../utils/utils'
import ReviewPage, { ReviewItem } from './reviewPage'

export default class ComplianceReviewPage extends ReviewPage {
  private timeBackPath: string

  private attendanceBackPath: string

  constructor(
    private action: AppointmentCompletedAction,
    private appointment: AppointmentDto,
    private contactOutcomes: ContactOutcomesDto,
    private formId: string,
    private formData: AppointmentOutcomeForm,
    private reqBody: {
      hiVis: string
      workedIntensively: string
      workQuality: string
      behaviour: string
      notes: string
      isSensitive: boolean
    },
  ) {
    super('compliance', action === 'leftEarly' ? 'Left site' : 'Session complete', {})

    const path = this.action === 'leftEarly' ? paths.appointments.leftEarly : paths.appointments.completed

    this.timeBackPath = pathWithQuery(
      path.endTime({
        projectCode: this.appointment.projectCode,
        appointmentId: this.appointment.id.toString(),
      }),
      { form: this.formId },
    )

    if (action === 'completed') {
      this.attendanceBackPath = pathWithQuery(
        paths.appointments[action].endTime({
          projectCode: this.appointment.projectCode,
          appointmentId: this.appointment.id.toString(),
        }),
        { form: this.formId },
      )
    } else {
      this.attendanceBackPath = pathWithQuery(
        paths.appointments.leftEarly.reason({
          projectCode: this.appointment.projectCode,
          appointmentId: this.appointment.id.toString(),
        }),
        { form: this.formId },
      )
    }

    this.changeUrl = pathWithQuery(
      path.compliance({
        projectCode: this.appointment.projectCode,
        appointmentId: this.appointment.id.toString(),
      }),
      { form: this.formId },
    )
  }

  protected mappedReviewFields(): ReviewItem {
    const fields: ReviewItem = {}

    if (this.action === 'leftEarly') {
      fields.Attendance = {
        value: this.contactOutcomes.contactOutcomes.find(outcome => {
          return outcome.code === this.formData.contactOutcomeCode
        })?.name,
        changeUrl: this.attendanceBackPath,
      }
    }

    // Not_applicable -> Not applicable
    const fmtLabel = (str: string) => properCase(str).replace(/_/, ' ')

    return {
      ...fields,
      Time: { value: this.formData?.endTime, changeUrl: this.timeBackPath },
      'Hi-vis': properCase(this.reqBody.hiVis),
      'Worked intensively': properCase(this.reqBody.workedIntensively),
      'Work quality': fmtLabel(this.reqBody.workQuality),
      Behaviour: fmtLabel(this.reqBody.behaviour),
      Notes: this.reqBody.notes,
      Sensitivity: this.reqBody.isSensitive
        ? 'Cannot be shared with person on probation'
        : 'Can be shared with person on probation',
    }
  }
}
