import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import SessionClient from './sessionClient'
import config from '../config'
import paths from '../paths/api'
import sessionFactory from '../testutils/factories/sessionFactory'

describe('SessionClient', () => {
  let sessionClient: SessionClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    sessionClient = new SessionClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('find', () => {
    it('should make a GET request to the find sessions path using user token and return the response body', async () => {
      const projectCode = '1'
      const date = '2026-01-01'

      const session = sessionFactory.build()

      nock(config.apis.communityPaybackApi.url)
        .get(paths.projects.session({ projectCode, date }))
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, session)

      const response = await sessionClient.find({ username: 'some-username', projectCode, date })

      expect(response).toEqual(session)
    })
  })
})
