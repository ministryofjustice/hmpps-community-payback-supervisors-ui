import type { SuperAgentRequest } from 'superagent'
import { stubFor, arrayToQueryStubMappings } from './wiremock'
import paths from '../../server/paths/api'
import type { PagedModelSessionSummaryDto, SessionDto } from '../../server/@types/shared'
import { SessionSummariesDto } from '../../server/@types/user-defined'

const singlePageOf = (sessionSummaries: SessionSummariesDto) =>
  ({
    content: sessionSummaries.allocations,
    page: {
      number: 0,
      size: sessionSummaries.allocations.length,
      totalElements: sessionSummaries.allocations.length,
      totalPages: 1,
    },
  }) satisfies PagedModelSessionSummaryDto

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
  stubNextSessions: ({
    sessionSummaries,
    teamCodes,
  }: {
    sessionSummaries: SessionSummariesDto
    teamCodes: string[]
  }): SuperAgentRequest => {
    const query = {
      teamCodes: {
        includes: arrayToQueryStubMappings(teamCodes),
      },
    }
    return stubFor({
      request: {
        method: 'GET',
        urlPath: paths.sessions.next.pattern,
        queryParameters: query,
      },

      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: singlePageOf(sessionSummaries),
      },
    })
  },
  stubFindFilteredSessions: ({
    sessionSummaries,
    teamCode,
    date,
  }: {
    sessionSummaries: SessionSummariesDto
    teamCode: string
    date: string
  }): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: paths.sessions.search({ teamCode }),
        queryParameters: {
          startDate: { equalTo: date },
          endDate: { equalTo: date },
        },
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: singlePageOf(sessionSummaries),
      },
    }),
}
