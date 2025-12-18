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
    const team = supervisorTeamFactory.build()
    const supervisor = supervisorFactory.build({ unpaidWorkTeams: [team] })
    const allocations = sessionSummaryFactory.buildList(2)

    sessionClient.nextSessions.mockResolvedValue({ allocations })
    const result = await sessionService.getNextSessions('some-username', supervisor)

    expect(sessionClient.nextSessions).toHaveBeenCalledTimes(1)
    expect(result).toEqual(allocations)
  })

  it('should make a call to nextSession for each unpaid work team and return one list', async () => {
    const unpaidWorkTeams = supervisorTeamFactory.buildList(2)
    const supervisor = supervisorFactory.build({ unpaidWorkTeams })
    const firstTeamAllocations = sessionSummaryFactory.buildList(2)
    const secondTeamAllocations = sessionSummaryFactory.buildList(1)

    sessionClient.nextSessions.mockResolvedValueOnce({ allocations: firstTeamAllocations })
    sessionClient.nextSessions.mockResolvedValueOnce({ allocations: secondTeamAllocations })

    const result = await sessionService.getNextSessions('some-username', supervisor)
    expect(sessionClient.nextSessions).toHaveBeenCalledTimes(2)
    expect(result).toEqual([...firstTeamAllocations, ...secondTeamAllocations])
  })
})
