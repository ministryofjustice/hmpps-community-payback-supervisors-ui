import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const stubFrontendComponentsPing = (httpStatus = 200): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/frontend-components/health/ping',
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
    },
  })

export default { stubFrontendComponentsPing }
