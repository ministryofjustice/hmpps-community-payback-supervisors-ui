import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import OffenderClient from './offenderClient'
import path from '../paths/api'
import caseDetailsFactory from '../testutils/factories/caseDetailsFactory'

describe('offenderClient', () => {
  let offenderClient: OffenderClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    offenderClient = new OffenderClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getOffenderSummary', () => {
    it('should make a GET request to the offender summary path using the user token and return the response', async () => {
      const crn = 'ABC1234'

      const caseDetails = caseDetailsFactory.build()

      nock(config.apis.communityPaybackApi.url)
        .get(path.offenderSummary({ crn }))
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, caseDetails)

      const response = await offenderClient.getOffenderSummary({ username: 'some-username', crn })

      expect(response).toEqual(caseDetails)
    })
  })
})
