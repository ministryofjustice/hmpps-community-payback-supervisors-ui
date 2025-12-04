import { AttendanceDataDto, AppointmentDto, UpdateAppointmentOutcomeDto } from '../../../@types/shared'
import { GovUkRadioOption, YesOrNo, ValidationErrors, AppointmentCompletedAction } from '../../../@types/user-defined'
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
  ) {
    super()
  }

  requestBody(appointment: AppointmentDto, contactOutcomeCode: string): UpdateAppointmentOutcomeDto {
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
      contactOutcomeCode,
    }
  }

  viewData(appointment: AppointmentDto): ViewData {
    const hiVisItems = GovUkRadioGroup.yesNoItems({
      checkedValue: this.hasFormBody('hiVis')
        ? GovUkRadioGroup.valueFromYesOrNoItem(this.query.hiVis)
        : appointment.attendanceData?.hiVisWorn,
    })

    const workedIntensivelyItems = GovUkRadioGroup.yesNoItems({
      checkedValue: this.hasFormBody('workedIntensively')
        ? GovUkRadioGroup.valueFromYesOrNoItem(this.query.workedIntensively)
        : appointment.attendanceData?.workedIntensively,
    })

    return {
      ...this.commonViewData(appointment),
      hiVisItems,
      workedIntensivelyItems,
      workQualityItems: this.getItems(
        this.hasFormBody('workQuality') ? this.query.workQuality : appointment.attendanceData?.workQuality,
      ),
      behaviourItems: this.getItems(
        this.hasFormBody('behaviour') ? this.query.behaviour : appointment.attendanceData?.behaviour,
      ),
      notes: this.hasFormBody('notes') ? this.query.notes : null,
    }
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
    // TODO: Add routing logic to different confirm pages based on action
    return paths.appointments.confirm.completed({ projectCode, appointmentId })
  }

  protected updatePath(appointment: AppointmentDto): string {
    return paths.appointments[this.action].compliance({
      projectCode: appointment.projectCode,
      appointmentId: appointment.id.toString(),
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

  private hasFormBody(property: keyof ComplianceQuery): boolean {
    return this.query[property] !== undefined
  }
}
