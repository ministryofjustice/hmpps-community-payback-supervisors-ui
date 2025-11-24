import nock from 'nock'
import { AuthenticationClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import FormClient from './formClient'
import paths from '../paths/api'

describe('formClient', () => {
  let formClient: FormClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    formClient = new FormClient(mockAuthenticationClient)
  })

  describe('find', () => {
    it('should make a GET request to the forms path using user token and return the response body', async () => {
      const type = 'some-type'
      const id = '1'

      const form = {
        answer1: 1,
        answer2: '2',
        answer3: { test: 'sample' },
      }

      nock(config.apis.communityPaybackApi.url)
        .get(paths.forms({ type, id }))
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, form)

      const response = await formClient.find({ type, id }, 'some-user')

      expect(response).toEqual(form)
    })

    it('should return a null result if result is Not Found (error)', async () => {
      const type = 'some-type'
      const id = '1'

      nock(config.apis.communityPaybackApi.url)
        .get(paths.forms({ type, id }))
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(404)

      const response = await formClient.find({ type, id }, 'some-user')

      expect(response).toEqual(null)
    })

    it('should throw error if response is not OK and not 404', async () => {
      const type = 'some-type-2'
      const id = '11'

      nock(config.apis.communityPaybackApi.url)
        .get(paths.forms({ type, id }))
        .matchHeader('authorization', 'Bearer test-system-token')
        .replyWithError('Something went wrong')

      expect(() => formClient.find({ type, id }, 'some-user')).rejects.toThrow('Something went wrong')
    })
  })

  describe('save', () => {
    it('should make a PUT request to the forms path using user token', async () => {
      const type = 'some-type'
      const id = '1'

      const form = {
        answer1: 1,
        answer2: '2',
        answer3: { test: 'sample' },
      }

      nock(config.apis.communityPaybackApi.url)
        .put(paths.forms({ type, id }), form)
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200)

      const response = await formClient.save({ type, id }, 'some-user', form)

      expect(response).toBeTruthy()
    })
  })
})
