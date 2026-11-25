import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import ReferenceDataClient from './referenceDataClient'
import path from '../paths/api'

describe('ReferenceDataClient', () => {
  let referenceDataClient: ReferenceDataClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn(username => {
        return `test-system-token-for-${username}`
      }),
    } as unknown as jest.Mocked<AuthenticationClient>

    referenceDataClient = new ReferenceDataClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getContactOutcomes', () => {
    it('should make a GET request to the contact-outcomes path using system token and return the response body', async () => {
      const contactOutcomes = {
        contactOutcomes: [
          {
            id: 1001,
            name: 'Cleaning',
          },
        ],
      }
      nock(config.apis.communityPaybackApi.url)
        .get(path.referenceData.contactOutcomes.pattern)
        .matchHeader('authorization', 'Bearer test-system-token-for-some-username')
        .reply(200, contactOutcomes)

      const response = await referenceDataClient.getContactOutcomes('some-username')

      expect(response).toEqual(contactOutcomes)
    })
  })
})
