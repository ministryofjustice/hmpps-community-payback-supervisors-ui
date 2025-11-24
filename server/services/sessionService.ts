import { SessionDto, SessionSummaryDto } from '../@types/shared'
import { GetSessionRequest, GetNextSessionRequest } from '../@types/user-defined'
import SessionClient from '../data/sessionClient'

export default class SessionService {
  constructor(private readonly sessionClient: SessionClient) {}

  getSession(request: GetSessionRequest): Promise<SessionDto> {
    return this.sessionClient.find(request)
  }

  getNextSession(request: GetNextSessionRequest): Promise<SessionSummaryDto> {
    return this.sessionClient.nextSession(request)
  }
}
