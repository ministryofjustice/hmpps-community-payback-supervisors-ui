import { AppointmentDto, FormKeyDto, SessionDto } from '../@types/shared'
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

  async getStatus(appointment: AppointmentDto, username: string): Promise<AppointmentStatusType> {
    const formKey = this.getFormKey(appointment)
    const data = await this.formClient.find<AppointmentStatuses>(formKey, username)

    const appointmentStatus = data?.appointmentStatuses.find(status => status.appointmentId === appointment.id)

    if (appointmentStatus) {
      return appointmentStatus.status
    }

    return this.defaultAppointmentStatusType(appointment.contactOutcomeCode)
  }

  async getStatusesForSession(session: SessionDto, username: string): Promise<AppointmentStatus[]> {
    const formKey = this.getFormKey(session)
    const data = await this.formClient.find<AppointmentStatuses>(formKey, username)

    const statusEntries = data?.appointmentStatuses ?? []

    return session.appointmentSummaries.map(appointment => {
      return (
        statusEntries.find(entry => entry.appointmentId === appointment.id) ?? {
          appointmentId: appointment.id,
          status: this.defaultAppointmentStatusType(appointment.contactOutcome?.code),
        }
      )
    })
  }

  async updateStatus(appointment: AppointmentDto, statusType: AppointmentStatusType, username: string): Promise<void> {
    const formKey = this.getFormKey(appointment)
    const data = await this.formClient.find<AppointmentStatuses>(formKey, username)

    const statuses = data?.appointmentStatuses ?? []

    const appointmentStatusIndex = statuses.findIndex(status => status.appointmentId === appointment.id)

    if (appointmentStatusIndex > -1) {
      statuses[appointmentStatusIndex].status = statusType
    } else {
      statuses.push({ appointmentId: appointment.id, status: statusType })
    }

    return this.saveStatusesForSession(formKey, username, statuses)
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

  private async saveStatusesForSession(
    formKey: FormKeyDto,
    username: string,
    appointmentStatuses: AppointmentStatus[],
  ) {
    await this.formClient.save(formKey, username, { appointmentStatuses })
  }

  private defaultAppointmentStatusType(contactOutcomeCode: string | null): AppointmentStatusType {
    return contactOutcomeCode ? 'Not expected' : 'Scheduled'
  }

  private getFormKey(sessionOrAppointment: Pick<SessionDto | AppointmentDto, 'projectCode' | 'date'>): FormKeyDto {
    return {
      id: sessionOrAppointment.projectCode + sessionOrAppointment.date,
      type: APPOINTMENT_STATUS_FORM_TYPE,
    }
  }
}
