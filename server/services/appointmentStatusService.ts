import { FormKeyDto, SessionDto } from '../@types/shared'
import { AppointmentStatusType } from '../@types/user-defined'
import FormClient from '../data/formClient'

export interface AppointmentStatus {
  status: AppointmentStatusType
  appointmentId: number
}

interface AppointmentStatuses {
  appointmentStatuses: AppointmentStatus[]
}

export const APPOINTMENT_STATUS_FORM_TYPE = 'APPOINTMENT_STATUSES_SUPERVISOR'

export default class AppointmentStatusService {
  constructor(private readonly formClient: FormClient) {}

  async getStatusesForSession(session: SessionDto, username: string): Promise<AppointmentStatus[]> {
    const formKey = this.getFormKey(session)
    const data = await this.formClient.find<AppointmentStatuses>(formKey, username)

    if (data) {
      return data.appointmentStatuses
    }

    return this.createStatusesForSession(session, username)
  }

  private async createStatusesForSession(session: SessionDto, username: string): Promise<AppointmentStatus[]> {
    const formKey = this.getFormKey(session)

    const appointmentStatuses = session.appointmentSummaries.map(appt => {
      const status: AppointmentStatusType = 'Scheduled'
      return {
        appointmentId: appt.id,
        status,
      } as AppointmentStatus
    })

    await this.formClient.save(formKey, username, { appointmentStatuses })

    return appointmentStatuses
  }

  private getFormKey(session: SessionDto): FormKeyDto {
    return {
      id: session.projectCode + session.date,
      type: APPOINTMENT_STATUS_FORM_TYPE,
    }
  }
}
