import SessionClient from '../data/sessionClient'
import SessionService from './sessionService'
import sessionFactory from '../testutils/factories/sessionFactory'
import sessionSummaryFactory from '../testutils/factories/sessionSummaryFactory'
import { SessionSummariesDto } from '../@types/user-defined'

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
    const sessionData = {
      allocations: [sessionSummaryFactory.build(), sessionSummaryFactory.build()],
    } as SessionSummariesDto

    sessionClient.nextSessions.mockResolvedValue(sessionData)
    const result = await sessionService.getNextSessions({
      teamCode: 'N56DTX',
      providerCode: 'N56',
      username: 'some-username',
    })

    expect(sessionClient.nextSessions).toHaveBeenCalledTimes(1)
    expect(result).toEqual(sessionData)
  })
})
