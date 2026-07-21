import { RestClient, AuthenticationClient, asSystem } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'
import paths from '../paths/api'
import { PagedModelSessionSummaryDto, SessionDto } from '../@types/shared'
import { GetNextSessionsRequest, GetSessionRequest } from '../@types/user-defined'
import { createQueryString } from '../utils/utils'

export default class SessionClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('sessionClient', config.apis.communityPaybackApi, logger, authenticationClient)
  }

  async find({ username, projectCode, date }: GetSessionRequest): Promise<SessionDto> {
    const path = paths.projects.session({ projectCode, date })
    return (await this.get({ path }, asSystem(username))) as SessionDto
  }

  async nextSessions({ username, teamCodes, page }: GetNextSessionsRequest): Promise<PagedModelSessionSummaryDto> {
    const path = paths.sessions.next({})
    const query = createQueryString({ teamCodes, page })
    return (await this.get({ path, query }, asSystem(username))) as PagedModelSessionSummaryDto
  }
}
