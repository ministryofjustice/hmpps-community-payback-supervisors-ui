import { SuperAgentRequest } from 'superagent'
import { SupervisorDto } from '../../server/@types/shared'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'

export default {
  stubFindSupervisor: ({ supervisor }: { supervisor: SupervisorDto }): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPathPattern: paths.supervisors.supervisor.pattern,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: supervisor,
      },
    })
  },
}
