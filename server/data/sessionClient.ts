import { RestClient, AuthenticationClient, asSystem, SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'
import paths from '../paths/api'
import { SessionDto, SessionSummaryDto } from '../@types/shared'
import { GetNextSessionRequest, GetSessionRequest } from '../@types/user-defined'

export default class SessionClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('sessionClient', config.apis.communityPaybackApi, logger, authenticationClient)
  }

  async find({ username, projectCode, date }: GetSessionRequest): Promise<SessionDto> {
    const path = paths.projects.session({ projectCode, date })
    return (await this.get({ path }, asSystem(username))) as SessionDto
  }

  async nextSession({ username, supervisorCode }: GetNextSessionRequest): Promise<SessionSummaryDto> {
    const path = paths.sessions.next({ supervisorCode })

    const errorHandler = <ERROR>(_path: string, _verb: string, error: SanitisedError<ERROR>): null => {
      if (error.responseStatus === 404) {
        return null
      }
      throw error
    }

    return (await this.get({ path, errorHandler }, asSystem(username))) as SessionSummaryDto
  }
}
