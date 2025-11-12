import SessionClient from '../data/sessionClient'
import SessionService from './sessionService'
import sessionFactory from '../testutils/factories/sessionFactory'

jest.mock('../data/sessionClient')

describe('ProviderService', () => {
  const sessionClient = new SessionClient(null) as jest.Mocked<SessionClient>
  let sessionService: SessionService

  beforeEach(() => {
    sessionService = new SessionService(sessionClient)
  })

  it('should call find on the client and return its result', async () => {
    const session = sessionFactory.build()

    sessionClient.find.mockResolvedValue(session)
    const result = await sessionService.getSession({
      username: 'some-username',
      projectCode: '1',
      date: '2025-01-01',
    })

    expect(sessionClient.find).toHaveBeenCalledTimes(1)
    expect(result).toEqual(session)
    expect(result.appointmentSummaries[0]).toEqual(session.appointmentSummaries[0])
  })
})
