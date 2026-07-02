import { AttendanceDataDto, AppointmentDto } from '../../../@types/shared'
import {
  GovUkRadioOption,
  YesOrNo,
  ValidationErrors,
  AppointmentCompletedAction,
  AppointmentOutcomeForm,
} from '../../../@types/user-defined'
import paths from '../../../paths'
import { pathWithQuery } from '../../../utils/utils'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'

interface ViewData extends AppointmentUpdatePageViewData {
  workQualityItems: GovUkRadioOption[]
  behaviourItems: GovUkRadioOption[]
  notes?: string
  isSensitive?: boolean
}

interface Body {
  workQuality: NonNullable<AttendanceDataDto['workQuality']>
  behaviour: NonNullable<AttendanceDataDto['behaviour']>
  notes?: string
  isSensitive?: string
}

export interface ComplianceQuery {
  workQuality?: AttendanceDataDto['workQuality']
  behaviour?: AttendanceDataDto['behaviour']
  alertPractitioner?: YesOrNo
}

export default class CompliancePage extends BaseAppointmentUpdatePage<Body> {
  constructor(
    private readonly action: AppointmentCompletedAction,
    private readonly formId: string,
    private readonly query: ComplianceQuery,
  ) {
    super()
  }

  updateForm(appointment: AppointmentDto, form: AppointmentOutcomeForm): AppointmentOutcomeForm {
    return {
      ...form,
      attendanceData: {
        ...appointment.attendanceData,
        workQuality: this.query.workQuality,
        behaviour: this.query.behaviour,
      },
    }
  }

  viewData(appointment: AppointmentDto, formData: AppointmentOutcomeForm): ViewData {
    const formValues = this.formValues(appointment, formData)

    return {
      ...this.commonViewData(appointment),
      workQualityItems: this.getItems(formValues.workQuality),
      behaviourItems: this.getItems(formValues.behaviour),
    }
  }

  protected getValidationErrors(): ValidationErrors<Body> {
    const errors: ValidationErrors<Body> = {}

    if (!this.query.workQuality) {
      errors.workQuality = { text: 'Select a description of the quality of their work ' }
    }

    if (!this.query.behaviour) {
      errors.behaviour = { text: 'Select a description of their behaviour ' }
    }

    return errors
  }

  protected backPath(appointment: AppointmentDto): string {
    return pathWithQuery(
      paths.appointments[this.action].endTime({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      { form: this.formId },
    )
  }

  nextPath(projectCode: string, appointmentId: string): string {
    return pathWithQuery(
      paths.appointments.notes.completed({
        projectCode,
        appointmentId,
      }),
      { form: this.formId },
    )
  }

  protected updatePath(appointment: AppointmentDto): string {
    const path = paths.appointments[this.action].compliance

    return pathWithQuery(
      path({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      { form: this.formId },
    )
  }

  private getItems(checkedValue?: string) {
    const options = [
      { text: 'Excellent', value: 'EXCELLENT' },
      { text: 'Good', value: 'GOOD' },
      { text: 'Satisfactory', value: 'SATISFACTORY' },
      { text: 'Unsatisfactory', value: 'UNSATISFACTORY' },
      { text: 'Poor', value: 'POOR' },
      { text: 'Not applicable', value: 'NOT_APPLICABLE' },
    ]

    return options.map(option => ({
      ...option,
      checked: option.value === checkedValue,
    }))
  }

  private formValues(appointment: AppointmentDto, formData: AppointmentOutcomeForm): ComplianceQuery {
    if (this.hasFormBody) {
      return this.query
    }

    if (formData.contactOutcomeCode !== appointment.contactOutcomeCode) {
      return {
        workQuality: null,
        behaviour: null,
      }
    }

    if (formData.attendanceData) {
      return {
        workQuality: formData.attendanceData?.workQuality,
        behaviour: formData.attendanceData?.behaviour,
      }
    }

    return {
      workQuality: appointment.attendanceData?.workQuality,
      behaviour: appointment.attendanceData?.behaviour,
    }
  }

  private get hasFormBody() {
    return Object.keys(this.query).length > 0
  }
}
