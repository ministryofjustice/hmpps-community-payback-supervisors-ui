import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import SupervisorClient from './supervisorClient'
import config from '../config'
import paths from '../paths/api'
import supervisorFactory from '../testutils/factories/supervisorFactory'

describe('SupervisorClient', () => {
  let supervisorClient: SupervisorClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    supervisorClient = new SupervisorClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('find', () => {
    it('should make a GET request to the find supervisor path using user token and return the response body', async () => {
      const supervisor = supervisorFactory.build()
      const username = 'some-username'
      nock(config.apis.communityPaybackApi.url)
        .get(`${paths.supervisors.supervisor({})}?username=${username}`)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, supervisor)

      const response = await supervisorClient.find(username)

      expect(response).toEqual(supervisor)
    })
  })
})
