import { AppointmentDto, AppointmentSummaryDto, FormKeyDto, SessionDto } from '../@types/shared'
import { AppointmentStatusType } from '../@types/user-defined'
import config from '../config'
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

  async getStatus(appointment: AppointmentDto, username: string): Promise<AppointmentStatus> {
    const formKey = this.getFormKey(appointment)
    const data = await this.formClient.find<AppointmentStatuses>(formKey, username)

    const appointmentStatus = data?.appointmentStatuses.find(status => status.appointmentId === appointment.id)

    if (appointmentStatus) {
      return appointmentStatus
    }

    return this.getNewAppointmentStatus(appointment)
  }

  async getStatusesForSession(session: SessionDto, username: string): Promise<AppointmentStatus[]> {
    const formKey = this.getFormKey(session)
    const data = await this.formClient.find<AppointmentStatuses>(formKey, username)

    if (data) {
      return this.getOrCreateAllAppointmentStatuses(data.appointmentStatuses, session, formKey, username)
    }

    return this.createStatusesForSession(session, username)
  }

  /**
   * Updates an existing status for a single appointment.
   * Assumes that `getStatusesForSession` (and implicitly `createStatusesForSession`) has been called previously for a session,
   * as the appointment page is only accessible from the session page—where statuses are set up for the session appointments.
   */
  async updateStatus(appointment: AppointmentDto, statusType: AppointmentStatusType, username: string): Promise<void> {
    const formKey = this.getFormKey(appointment)
    const data = await this.formClient.find<AppointmentStatuses>(formKey, username)

    const appointmentStatusIndex = data?.appointmentStatuses.findIndex(
      status => status.appointmentId === appointment.id,
    )

    if (appointmentStatusIndex > -1) {
      data.appointmentStatuses[appointmentStatusIndex].status = statusType
      return this.saveStatusesForSession(formKey, username, data.appointmentStatuses)
    }

    throw new Error(`No appointment status found for project ${appointment.projectCode} on ${appointment.date}`)
  }

  /**
   * Only intended for use in developer environments
   */
  async clearStatusesForSession(projectCode: string, date: string, username: string): Promise<void> {
    if (config.flags.enableClearSessionStatuses) {
      const formKey = this.getFormKey({ date, projectCode })

      return this.formClient.clear(formKey, username)
    }

    throw new Error('Clearing session statuses not enabled')
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

  private getFormKey(sessionOrAppointment: Pick<SessionDto | AppointmentDto, 'projectCode' | 'date'>): FormKeyDto {
    return {
      id: sessionOrAppointment.projectCode + sessionOrAppointment.date,
      type: APPOINTMENT_STATUS_FORM_TYPE,
    }
  }
}
