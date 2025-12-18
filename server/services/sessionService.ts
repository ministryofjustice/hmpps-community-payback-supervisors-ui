import { SessionDto, SessionSummaryDto, SupervisorDto } from '../@types/shared'
import { GetSessionRequest } from '../@types/user-defined'
import SessionClient from '../data/sessionClient'

export default class SessionService {
  constructor(private readonly sessionClient: SessionClient) {}

  getSession(request: GetSessionRequest): Promise<SessionDto> {
    return this.sessionClient.find(request)
  }

  async getNextSessions(username: string, supervisor: SupervisorDto): Promise<SessionSummaryDto[]> {
    const nextSessions: SessionSummaryDto[] = []
    const { unpaidWorkTeams } = supervisor

    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < unpaidWorkTeams.length; i += 1) {
      const team = unpaidWorkTeams[i]
      const result = await this.sessionClient.nextSessions({
        username,
        providerCode: team.provider.code,
        teamCode: team.code,
      })
      nextSessions.push(...result.allocations)
    }

    return nextSessions
  }
}
