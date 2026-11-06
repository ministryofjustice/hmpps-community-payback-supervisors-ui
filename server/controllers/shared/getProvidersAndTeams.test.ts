import type { Response } from 'express'
import ProviderService from '../../services/providerService'
import getProvidersAndTeams from './getProvidersAndTeams'
import GovUkSelectInput from '../../forms/GovUkSelectInput'
import providerSummaryFactory from '../../testutils/factories/providerSummaryFactory'
import { GovUkSelectOption } from '../../@types/user-defined'
import getTeams from './getTeams'

jest.mock('./getTeams')

describe('getProvidersAndTeams', () => {
  const teamItems = [
    { value: '1', text: 'Team 1' },
    { value: '2', text: 'Team 2' },
  ]
  const getTeamsMock: jest.Mock = getTeams as unknown as jest.Mock<Promise<Array<GovUkSelectOption>>>

  beforeEach(() => {
    jest.resetAllMocks()
    getTeamsMock.mockResolvedValue(teamItems)
  })

  it('returns a list of team items for single provider', async () => {
    const provider = providerSummaryFactory.build()

    const providerService = {
      getProviders: jest.fn(() => [provider]),
    } as unknown as ProviderService

    const params = {
      response: {
        locals: {
          user: {
            username: 'username',
          },
        },
      } as Response,
      providerService,
    }

    const result = await getProvidersAndTeams(params)

    expect(result).toEqual({
      provider: { text: provider.name, value: provider.code },
      teamItems,
    })
  })

  it('returns a list of providers if multiple providers and no provider code', async () => {
    const providers = providerSummaryFactory.buildList(2)

    const providerService = {
      getProviders: jest.fn(() => providers),
    } as unknown as ProviderService

    const params = {
      response: {
        locals: {
          user: {
            username: 'username',
          },
        },
      } as Response,
      providerService,
    }

    const providerItems = [
      { value: '1', text: 'Provider 1' },
      { value: '2', text: 'Provider 2' },
    ]
    jest.spyOn(GovUkSelectInput, 'getOptions').mockReturnValue(providerItems)

    const result = await getProvidersAndTeams(params)

    expect(result).toEqual({
      providerItems,
      teamItems,
    })
  })

  it.each(['Y', undefined, ''])(
    'returns a list of providers and teams if multiple providers and provider code',
    async (teamCode?: string) => {
      const providerCode = 'X'
      const providers = providerSummaryFactory.buildList(2)

      const providerService = {
        getProviders: jest.fn(() => providers),
      } as unknown as ProviderService

      const params = {
        providerCode,
        teamCode,
        response: {
          locals: {
            user: {
              username: 'username',
            },
          },
        } as Response,
        providerService,
      }

      const providerItems = [
        { value: '1', text: 'Provider 1' },
        { value: '2', text: 'Provider 2' },
      ]
      jest.spyOn(GovUkSelectInput, 'getOptions').mockReturnValueOnce(providerItems)

      const result = await getProvidersAndTeams(params)

      expect(result).toEqual({
        provider: { value: providerCode },
        providerItems,
        teamItems,
      })
    },
  )
})
