import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'
import type { SessionDto } from '../../server/@types/shared'

export default {
  stubFindSession: ({ session }: { session: SessionDto }): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPathPattern: paths.projects.session({ projectCode: 'N56123456', date: '2025-09-22' }),
      },

      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: session,
      },
    })
  },
}
