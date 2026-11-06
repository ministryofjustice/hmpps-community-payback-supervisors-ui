import { SuperAgentRequest } from 'superagent'
import { ProviderTeamSummariesDto } from '../../server/@types/shared'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'

export default {
  stubGetTeams: ({ team }: { team: ProviderTeamSummariesDto }): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPathPattern: paths.providers.teams.pattern,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: team,
      },
    })
  },
}
