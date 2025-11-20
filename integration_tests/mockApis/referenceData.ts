import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'
import { ContactOutcomesDto } from '../../server/@types/shared'

export default {
  stubGetContactOutcomes: (args: { contactOutcomes: ContactOutcomesDto }): SuperAgentRequest => {
    const { pattern } = paths.referenceData.contactOutcomes
    return stubFor({
      request: {
        method: 'GET',
        urlPathPattern: pattern,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          ...args.contactOutcomes,
        },
      },
    })
  },
}
