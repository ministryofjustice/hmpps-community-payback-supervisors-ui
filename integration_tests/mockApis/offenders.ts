import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'
import { CommonCaseDetailsSummaryDto } from '../../server/@types/shared'

export default {
  stubGetOffenderSummary: (args: { caseDetailsSummary: CommonCaseDetailsSummaryDto }): SuperAgentRequest => {
    const pattern = paths.offenderSummary({ crn: args.caseDetailsSummary.offender.crn })
    return stubFor({
      request: {
        method: 'GET',
        urlPathPattern: pattern,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          ...args.caseDetailsSummary,
        },
      },
    })
  },
}
