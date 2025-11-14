import { AppointmentDto } from '../@types/shared'
import { GetAppointmentRequest } from '../@types/user-defined'
import AppointmentClient from '../data/appointmentClient'

export default class AppointmentService {
  constructor(private readonly appointmentClient: AppointmentClient) {}

  async getAppointment({ username, appointmentId, projectCode }: GetAppointmentRequest): Promise<AppointmentDto> {
    const appointment = await this.appointmentClient.find({ username, appointmentId, projectCode })

    return appointment
  }
}
