import SessionClient from '../data/sessionClient'
import SessionService from './sessionService'
import sessionFactory from '../testutils/factories/sessionFactory'
import sessionSummaryFactory from '../testutils/factories/sessionSummaryFactory'
import supervisorTeamFactory from '../testutils/factories/supervisorTeamFactory'
import supervisorFactory from '../testutils/factories/supervisorFactory'

jest.mock('../data/sessionClient')

describe('ProviderService', () => {
  const sessionClient = new SessionClient(null) as jest.Mocked<SessionClient>
  let sessionService: SessionService

  beforeEach(() => {
    sessionService = new SessionService(sessionClient)
    jest.clearAllMocks()
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
    const unpaidWorkTeams = supervisorTeamFactory.buildList(2)
    const supervisor = supervisorFactory.build({ unpaidWorkTeams })
    const allocations = sessionSummaryFactory.buildList(2)

    sessionClient.nextSessions.mockResolvedValue({ content: allocations, page: { totalPages: 1 } })
    const result = await sessionService.getNextSessions('some-username', supervisor)

    expect(sessionClient.nextSessions).toHaveBeenCalledTimes(1)
    expect(result).toEqual(allocations)
  })

  it('should call nextSession multiple times on the client for multiple pages and return its result', async () => {
    const unpaidWorkTeams = supervisorTeamFactory.buildList(2)
    const supervisor = supervisorFactory.build({ unpaidWorkTeams })
    const firstAllocations = sessionSummaryFactory.buildList(2)
    const secondAllocations = sessionSummaryFactory.buildList(1)

    sessionClient.nextSessions.mockResolvedValueOnce({ content: firstAllocations, page: { totalPages: 2 } })
    sessionClient.nextSessions.mockResolvedValueOnce({ content: secondAllocations, page: { totalPages: 2 } })
    const result = await sessionService.getNextSessions('some-username', supervisor)

    expect(sessionClient.nextSessions).toHaveBeenCalledTimes(2)
    expect(result).toEqual([...firstAllocations, ...secondAllocations])
  })
})
