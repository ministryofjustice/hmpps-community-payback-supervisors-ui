import { RestClient, AuthenticationClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'
import paths from '../paths/api'
import { SupervisorDto } from '../@types/shared'
import { createQueryString } from '../utils/utils'

export default class SupervisorClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('supervisorClient', config.apis.communityPaybackApi, logger, authenticationClient)
  }

  async find(username: string): Promise<SupervisorDto> {
    const query = createQueryString({ username })
    const path = paths.supervisors.supervisor({})
    return (await this.get({ path, query }, asSystem(username))) as SupervisorDto
  }
}
