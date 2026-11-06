import { SuperAgentRequest } from 'superagent'
import { ProviderSummaryDto } from '../../server/@types/shared'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'

export default {
  stubGetProviders: ({ provider }: { provider: ProviderSummaryDto }): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPathPattern: paths.providers.providers.pattern,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: provider,
      },
    })
  },
}
