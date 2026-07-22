import { SessionDto, SessionSummaryDto, SupervisorDto } from '../@types/shared'
import { GetSessionRequest } from '../@types/user-defined'
import SessionClient from '../data/sessionClient'

export default class SessionService {
  constructor(private readonly sessionClient: SessionClient) {}

  getSession(request: GetSessionRequest): Promise<SessionDto> {
    return this.sessionClient.find(request)
  }

  async getNextSessions(username: string, supervisor: SupervisorDto): Promise<SessionSummaryDto[]> {
    const teamCodes = supervisor.unpaidWorkTeams.map(team => team.code)

    const nextSessions = []

    let page = 0
    let total = Number.MAX_VALUE

    /* eslint-disable no-await-in-loop */
    while (page < total) {
      const result = await this.sessionClient.nextSessions({
        username,
        teamCodes,
        page,
      })
      total = result.page.totalPages
      nextSessions.push(...result.content)
      page += 1
    }
    /* eslint-enable no-await-in-loop */

    return nextSessions
  }
}
