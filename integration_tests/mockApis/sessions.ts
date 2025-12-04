import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'
import type { SessionDto, SessionSummaryDto } from '../../server/@types/shared'
import { SessionSummariesDto } from '../../server/@types/user-defined'

export default {
  stubFindSession: ({ session }: { session: SessionDto }): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPathPattern: paths.projects.session({ projectCode: session.projectCode, date: session.date }),
      },

      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: session,
      },
    })
  },
  stubNextSessions: ({ sessionSummary }: { sessionSummary: SessionSummaryDto[] }): SuperAgentRequest => {
    const jsonBody = {
      allocations: [sessionSummary],
    } as SessionSummariesDto

    return stubFor({
      request: {
        method: 'GET',
        urlPathPattern: paths.sessions.next({ providerCode: 'N56', teamCode: 'N56DTX' }),
      },

      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody,
      },
    })
  },
}
