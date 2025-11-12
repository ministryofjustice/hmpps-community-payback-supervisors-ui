import { RestClient, AuthenticationClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'
import paths from '../paths/api'
import { SessionDto } from '../@types/shared'
import { GetSessionRequest } from '../@types/user-defined'

export default class SessionClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('sessionClient', config.apis.communityPaybackApi, logger, authenticationClient)
  }

  async find({ username, projectCode, date }: GetSessionRequest): Promise<SessionDto> {
    const path = paths.projects.session({ projectCode, date })
    return (await this.get({ path }, asSystem(username))) as SessionDto
  }
}
