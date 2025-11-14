import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import AppointmentClient from './appointmentClient'
import config from '../config'
import appointmentFactory from '../testutils/factories/appointmentFactory'
import paths from '../paths/api'

describe('AppointmentClient', () => {
  let appointmentClient: AppointmentClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    appointmentClient = new AppointmentClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('find', () => {
    it('should make a GET request to find appointment path using system token and return the response body', async () => {
      const projectCode = '1'
      const appointmentId = '1'

      const appointment = appointmentFactory.build()

      nock(config.apis.communityPaybackApi.url)
        .get(paths.appointments.singleAppointment({ projectCode, appointmentId }))
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200, appointment)

      const response = await appointmentClient.find({ username: 'some-username', projectCode, appointmentId })

      expect(response).toEqual(appointment)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalledTimes(1)
    })
  })
})
