import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'
import type { SessionDto, SessionSummaryDto } from '../../server/@types/shared'

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
  stubNextSession: ({ sessionSummary }: { sessionSummary: SessionSummaryDto }): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPathPattern: paths.sessions.next({ supervisorCode: 'N56A108' }),
      },

      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: sessionSummary,
      },
    })
  },
}
