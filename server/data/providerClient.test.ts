import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import ProviderClient from './providerClient'
import config from '../config'
import providerSummaryFactory from '../testutils/factories/providerSummaryFactory'

describe('ProviderClient', () => {
  let providerClient: ProviderClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    providerClient = new ProviderClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getProviders', () => {
    it('should make a GET request to the providers path using user token and return the response body', async () => {
      const providers = providerSummaryFactory.buildList(2)

      nock(config.apis.communityPaybackApi.url)
        .get('/common/providers?username=some-username')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, { providers })

      const response = await providerClient.getProviders('some-username')

      expect(response).toEqual({ providers })
    })
  })

  describe('getTeams', () => {
    it('should make a GET request to the teams path using user token and return the response body', async () => {
      const teams = {
        providers: [
          {
            id: 1001,
            name: 'Team Lincoln',
          },
        ],
      }
      nock(config.apis.communityPaybackApi.url)
        .get('/common/providers/some-provider-id/teams')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, teams)

      const response = await providerClient.getTeams('some-provider-id', 'some-username')

      expect(response).toEqual(teams)
    })
  })
})
