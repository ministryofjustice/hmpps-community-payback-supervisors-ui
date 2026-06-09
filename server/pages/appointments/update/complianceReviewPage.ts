import { AppointmentDto, ContactOutcomeDto, ContactOutcomesDto } from '../../../@types/shared'
import { AppointmentCompletedAction, AppointmentOutcomeForm } from '../../../@types/user-defined'
import paths from '../../../paths'
import { pathWithQuery, properCase } from '../../../utils/utils'
import { ComplianceQuery } from './compliancePage'
import ReviewPage, { ReviewItem } from './reviewPage'

export default class ComplianceReviewPage extends ReviewPage {
  private startTimeBackPath: string

  private endTimeBackPath: string

  constructor(
    private action: AppointmentCompletedAction,
    private appointment: AppointmentDto,
    private contactOutcomes: ContactOutcomesDto,
    private formId: string,
    private formData: AppointmentOutcomeForm,
    private reqBody: ComplianceQuery,
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

    this.showWillAlertPractitionerMessage = this.contactOutcome?.enforceable ?? false
  }

  protected mappedReviewFields(): ReviewItem {
    const fields: ReviewItem = {}

    // Not_applicable -> Not applicable
    const fmtLabel = (str: string) => properCase(str).replace(/_/, ' ')

    return {
      ...fields,
      'Start time': { value: this.formData?.startTime, changeUrl: this.startTimeBackPath },
      'End time': { value: this.formData?.endTime, changeUrl: this.endTimeBackPath },
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

  private get contactOutcome(): ContactOutcomeDto {
    return this.contactOutcomes.contactOutcomes.find(outcome => {
      return outcome.code === this.formData.contactOutcomeCode
    })
  }
}
