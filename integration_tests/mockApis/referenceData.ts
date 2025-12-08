import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'
import contactOutcomesJson from '../fixtures/contactOutcomes.json'
import { contactOutcomeFactory } from '../../server/testutils/factories/contactOutcomeFactory'

export default {
  stubGetContactOutcomes: (): SuperAgentRequest => {
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
          contactOutcomes: contactOutcomesJson.map(outcome =>
            contactOutcomeFactory.build({ code: outcome.code, name: outcome.name }),
          ),
        },
      },
    })
  },
}
