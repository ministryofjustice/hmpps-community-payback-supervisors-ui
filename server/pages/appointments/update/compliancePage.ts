import { AttendanceDataDto, AppointmentDto, UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import {
  GovUkRadioOption,
  YesOrNo,
  ValidationErrors,
  AppointmentCompletedAction,
  AppointmentStatusType,
} from '../../../@types/user-defined'
import paths from '../../../paths'
import GovUkRadioGroup from '../../../utils/GovUKFrontend/GovUkRadioGroup'
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
    private readonly query: ComplianceQuery,
    private readonly contactOutcomeCode: string,
  ) {
    super()
  }

  requestBody(appointment: AppointmentDto): UpdateAppointmentOutcomeDto {
    const data = this.appointmentRequestBody(appointment)
    return {
      ...data,
      notes: this.query.notes,
      attendanceData: {
        ...data.attendanceData,
        hiVisWorn: GovUkRadioGroup.valueFromYesOrNoItem(this.query.hiVis),
        workedIntensively: GovUkRadioGroup.valueFromYesOrNoItem(this.query.workedIntensively),
        workQuality: this.query.workQuality,
        behaviour: this.query.behaviour,
      },
      contactOutcomeCode: this.contactOutcomeCode,
    }
  }

  viewData(appointment: AppointmentDto): ViewData {
    return {
      ...this.commonViewData(appointment),
      hiVisItems: GovUkRadioGroup.yesNoItems({
        checkedValue: appointment.attendanceData?.hiVisWorn,
      }),
      workedIntensivelyItems: GovUkRadioGroup.yesNoItems({
        checkedValue: appointment.attendanceData?.workedIntensively,
      }),
      workQualityItems: this.getItems(appointment.attendanceData?.workQuality),
      behaviourItems: this.getItems(appointment.attendanceData?.behaviour),
      notes: null,
    }
  }

  completedStatus(): AppointmentStatusType {
    return this.completedStatusType[this.action]
  }

  protected getValidationErrors(): ValidationErrors<Body> {
    const errors: ValidationErrors<Body> = {}

    if (!this.query.hiVis) {
      errors.hiVis = { text: 'Select whether a Hi-Vis was worn' }
    }

    if (!this.query.workedIntensively) {
      errors.workedIntensively = { text: 'Select whether they worked intensively' }
    }

    if (!this.query.workQuality) {
      errors.workQuality = { text: 'Select their work quality' }
    }

    if (!this.query.behaviour) {
      errors.behaviour = { text: 'Select their behaviour' }
    }

    return errors
  }

  protected backPath(appointment: AppointmentDto): string {
    return paths.appointments[this.action].endTime({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
    })
  }

  nextPath(projectCode: string, appointmentId: string): string {
    return paths.appointments.confirm[this.action]({ projectCode, appointmentId })
  }

  protected updatePath(appointment: AppointmentDto): string {
    return paths.appointments[this.action].compliance({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
      contactOutcomeCode: this.contactOutcomeCode,
    })
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
}
