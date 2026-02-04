import { AttendanceDataDto, AppointmentDto, UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import {
  GovUkRadioOption,
  YesOrNo,
  ValidationErrors,
  AppointmentCompletedAction,
  AppointmentStatusType,
  AppointmentOutcomeForm,
} from '../../../@types/user-defined'
import paths from '../../../paths'
import ReferenceDataService from '../../../services/referenceDataService'
import GovUkRadioGroup from '../../../utils/GovUKFrontend/GovUkRadioGroup'
import { pathWithQuery } from '../../../utils/utils'
import BaseAppointmentUpdatePage, { AppointmentUpdatePageViewData } from './baseAppointmentUpdatePage'

interface ViewData extends AppointmentUpdatePageViewData {
  hiVisItems: GovUkRadioOption[]
  workedIntensivelyItems: GovUkRadioOption[]
  workQualityItems: GovUkRadioOption[]
  behaviourItems: GovUkRadioOption[]
  notes?: string
}

interface Body {
  hiVis: YesOrNo
  workedIntensively: YesOrNo
  workQuality: NonNullable<AttendanceDataDto['workQuality']>
  behaviour: NonNullable<AttendanceDataDto['behaviour']>
  notes?: string
}

export interface ComplianceQuery {
  hiVis?: YesOrNo
  workedIntensively?: YesOrNo
  workQuality?: AttendanceDataDto['workQuality']
  behaviour?: AttendanceDataDto['behaviour']
  notes?: string
}

export default class CompliancePage extends BaseAppointmentUpdatePage<Body> {
  constructor(
    private readonly action: AppointmentCompletedAction,
    private readonly formId: string,
    private readonly query: ComplianceQuery,
  ) {
    super()
  }

  requestBody(appointment: AppointmentDto, formData: AppointmentOutcomeForm): UpdateAppointmentOutcomeDto {
    const data = this.appointmentRequestBody(appointment)

    const contactOutcomeCode =
      this.action === 'completed' ? ReferenceDataService.attendedCompliedOutcomeCode : formData.contactOutcomeCode
    return {
      ...data,
      ...formData,
      notes: this.query.notes,
      attendanceData: {
        ...data.attendanceData,
        hiVisWorn: GovUkRadioGroup.valueFromYesOrNoItem(this.query.hiVis),
        workedIntensively: GovUkRadioGroup.valueFromYesOrNoItem(this.query.workedIntensively),
        workQuality: this.query.workQuality,
        behaviour: this.query.behaviour,
      },
      contactOutcomeCode,
    }
  }

  viewData(appointment: AppointmentDto, formData: AppointmentOutcomeForm): ViewData {
    const formValues = this.formValues(appointment, formData)

    return {
      ...this.commonViewData(appointment),
      hiVisItems: GovUkRadioGroup.yesNoItems({
        checkedValue: formValues.hiVis,
      }),
      workedIntensivelyItems: GovUkRadioGroup.yesNoItems({
        checkedValue: formValues.workedIntensively,
      }),
      workQualityItems: this.getItems(formValues.workQuality),
      behaviourItems: this.getItems(formValues.behaviour),
      notes: formValues.notes,
    }
  }

  completedStatus(): AppointmentStatusType {
    return this.completedStatusType[this.action]
  }

  protected getValidationErrors(): ValidationErrors<Body> {
    const errors: ValidationErrors<Body> = {}

    if (!this.query.hiVis) {
      errors.hiVis = { text: 'Select yes if they wore hi-vis' }
    }

    if (!this.query.workedIntensively) {
      errors.workedIntensively = { text: 'Select yes if they are working intensively' }
    }

    if (!this.query.workQuality) {
      errors.workQuality = { text: 'Select a description of the quality of their work ' }
    }

    if (!this.query.behaviour) {
      errors.behaviour = { text: 'Select a description of their behaviour ' }
    }

    if (this.query.notes && this.query.notes.length > 4000) {
      errors.notes = { text: 'Notes must be 4000 characters or less' }
    }

    return errors
  }

  protected backPath(appointment: AppointmentDto): string {
    if (this.action === 'completed') {
      return pathWithQuery(
        paths.appointments[this.action].endTime({
          projectCode: appointment.projectCode,
          appointmentId: appointment.id.toString(),
        }),
        { form: this.formId },
      )
    }

    return pathWithQuery(
      paths.appointments.leftEarly.reason({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      { form: this.formId },
    )
  }

  nextPath(projectCode: string, appointmentId: string): string {
    return paths.appointments.confirm[this.action]({ projectCode, appointmentId })
  }

  protected updatePath(appointment: AppointmentDto): string {
    return pathWithQuery(
      paths.appointments[this.action].compliance({
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

  private completedStatusType: Record<AppointmentCompletedAction, AppointmentStatusType> = {
    completed: 'Session complete',
    leftEarly: 'Left site',
  }

  private formValues(appointment: AppointmentDto, formData: AppointmentOutcomeForm): ComplianceQuery {
    if (this.hasFormBody) {
      return this.query
    }

    if (formData.contactOutcomeCode !== appointment.contactOutcomeCode) {
      return {
        hiVis: null,
        workedIntensively: null,
        workQuality: null,
        behaviour: null,
        notes: null,
      }
    }

    return {
      hiVis: GovUkRadioGroup.determineCheckedValue(appointment.attendanceData?.hiVisWorn),
      workedIntensively: GovUkRadioGroup.determineCheckedValue(appointment.attendanceData?.workedIntensively),
      workQuality: appointment.attendanceData?.workQuality,
      behaviour: appointment.attendanceData?.behaviour,
      notes: null,
    }
  }

  private get hasFormBody() {
    return Object.keys(this.query).length > 0
  }
}
