import SupervisorClient from '../data/supervisorClient'
import supervisorFactory from '../testutils/factories/supervisorFactory'
import SupervisorService from './supervisorService'

jest.mock('../data/supervisorClient')

describe('SupervisorService', () => {
  const supervisorClient = new SupervisorClient(null) as jest.Mocked<SupervisorClient>
  let supervisorService: SupervisorService

  beforeEach(() => {
    supervisorService = new SupervisorService(supervisorClient)
  })

  it('should call find on the client and return its result', async () => {
    const supervisor = supervisorFactory.build()

    supervisorClient.find.mockResolvedValue(supervisor)
    const result = await supervisorService.getSupervisor('some-username')

    expect(supervisorClient.find).toHaveBeenCalledTimes(1)
    expect(result).toEqual(supervisor)
  })
})
