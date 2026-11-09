import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import paths from '../../server/paths/api'
import type { ProviderTeamSummariesDto } from '../../server/@types/shared/models/ProviderTeamSummariesDto'
import { ProviderSummariesDto } from '../../server/@types/shared'

export default {
  stubGetProviders: (args: { providers: ProviderSummariesDto }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/common/providers\\?username=.*',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: args.providers,
      },
    }),
  stubGetTeams: ({
    teams,
    providerCode,
  }: {
    teams: ProviderTeamSummariesDto
    providerCode: string
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: paths.providers.teams({ providerCode }),
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: teams,
      },
    }),
  stubGetTeamsBadResponse: ({
    providerCode,
    responseCode,
  }: {
    providerCode: string
    responseCode: number
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: paths.providers.teams({ providerCode }),
      },
      response: {
        status: responseCode,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { reason: 'Something went wrong' },
      },
    }),
}
