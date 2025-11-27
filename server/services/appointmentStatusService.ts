import { AppointmentDto, AppointmentSummaryDto, FormKeyDto, SessionDto } from '../@types/shared'
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
      return this.getOrCreateAllAppointmentStatuses(data.appointmentStatuses, session, formKey, username)
    }

    return this.createStatusesForSession(session, username)
  }

  private async getOrCreateAllAppointmentStatuses(
    appointmentStatuses: AppointmentStatus[],
    session: SessionDto,
    formKey: FormKeyDto,
    username: string,
  ) {
    const newAppointmentStatuses = session.appointmentSummaries
      .filter(appointment => !appointmentStatuses.find(status => status.appointmentId === appointment.id))
      .map(this.getNewAppointmentStatus)

    if (newAppointmentStatuses.length) {
      appointmentStatuses.push(...newAppointmentStatuses)
      await this.saveStatusesForSession(formKey, username, appointmentStatuses)
    }

    return appointmentStatuses
  }

  private async createStatusesForSession(session: SessionDto, username: string): Promise<AppointmentStatus[]> {
    const formKey = this.getFormKey(session)

    const appointmentStatuses = session.appointmentSummaries.map(this.getNewAppointmentStatus)

    await this.saveStatusesForSession(formKey, username, appointmentStatuses)

    return appointmentStatuses
  }

  private async saveStatusesForSession(
    formKey: FormKeyDto,
    username: string,
    appointmentStatuses: AppointmentStatus[],
  ) {
    await this.formClient.save(formKey, username, { appointmentStatuses })
  }

  private getNewAppointmentStatus(appointment: AppointmentDto | AppointmentSummaryDto): AppointmentStatus {
    const status: AppointmentStatusType = 'Scheduled'
    return {
      appointmentId: appointment.id,
      status,
    }
  }

  private getFormKey(session: SessionDto): FormKeyDto {
    return {
      id: session.projectCode + session.date,
      type: APPOINTMENT_STATUS_FORM_TYPE,
    }
  }
}
