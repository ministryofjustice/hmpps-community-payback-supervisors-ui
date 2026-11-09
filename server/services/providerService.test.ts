import ProviderClient from '../data/providerClient'
import providerSummaryFactory from '../testutils/factories/providerSummaryFactory'
import ProviderService from './providerService'

jest.mock('../data/providerClient')

describe('ProviderService', () => {
  const providerClient = new ProviderClient(null) as jest.Mocked<ProviderClient>
  let providerService: ProviderService

  beforeEach(() => {
    jest.resetAllMocks()
    providerService = new ProviderService(providerClient)
  })

  it('should call getProviders on the api client and return its result', async () => {
    const providers = providerSummaryFactory.buildList(2)

    providerClient.getProviders.mockResolvedValue({ providers })

    const result = await providerService.getProviders('some-username')

    expect(providerClient.getProviders).toHaveBeenCalledTimes(1)
    expect(result).toEqual(providers)
  })

  it('should call getTeams on the api client and return its result', async () => {
    const teams = {
      providers: [
        {
          id: 1001,
          code: 'XRT123',
          name: 'Team Lincoln',
        },
      ],
    }

    providerClient.getTeams.mockResolvedValue(teams)

    const result = await providerService.getTeams('some-provider-id', 'some-username')

    expect(providerClient.getTeams).toHaveBeenCalledTimes(1)
    expect(result).toEqual(teams)
  })
})
