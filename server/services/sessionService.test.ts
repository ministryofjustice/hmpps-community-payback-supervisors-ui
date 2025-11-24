import SessionClient from '../data/sessionClient'
import SessionService from './sessionService'
import sessionFactory from '../testutils/factories/sessionFactory'
import sessionSummaryFactory from '../testutils/factories/sessionSummaryFactory'

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

  it('should call nextSession on the client and return its result', async () => {
    const sessionSummary = sessionSummaryFactory.build()

    sessionClient.nextSession.mockResolvedValue(sessionSummary)
    const result = await sessionService.getNextSession({
      supervisorCode: '1234',
      username: 'some-username',
    })

    expect(sessionClient.nextSession).toHaveBeenCalledTimes(1)
    expect(result).toEqual(sessionSummary)
  })
})
