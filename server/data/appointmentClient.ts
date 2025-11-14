import { asSystem, AuthenticationClient, RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'
import paths from '../paths/api'
import { AppointmentDto } from '../@types/shared/models/AppointmentDto'
import { GetAppointmentRequest } from '../@types/user-defined'

export default class AppointmentClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('AppointmentClient', config.apis.communityPaybackApi, logger, authenticationClient)
  }

  async find({ username, appointmentId, projectCode }: GetAppointmentRequest): Promise<AppointmentDto> {
    const path = paths.appointments.singleAppointment({ appointmentId, projectCode })
    return (await this.get({ path }, asSystem(username))) as AppointmentDto
  }
}
