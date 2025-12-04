import { SessionDto } from '../@types/shared'
import { GetSessionRequest, GetNextSessionsRequest, SessionSummariesDto } from '../@types/user-defined'
import SessionClient from '../data/sessionClient'

export default class SessionService {
  constructor(private readonly sessionClient: SessionClient) {}

  getSession(request: GetSessionRequest): Promise<SessionDto> {
    return this.sessionClient.find(request)
  }

  getNextSessions(request: GetNextSessionsRequest): Promise<SessionSummariesDto> {
    return this.sessionClient.nextSessions(request)
  }
}
