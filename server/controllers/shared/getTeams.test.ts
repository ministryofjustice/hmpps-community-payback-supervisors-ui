import type { Response } from 'express'
import ProviderService from '../../services/providerService'
import getTeams from './getTeams'
import providerTeamSummaryFactory from '../../testutils/factories/providerTeamSummaryFactory'
import GovUkSelectInput from '../../forms/GovUkSelectInput'
import { GetProvidersAndTeamsParams } from '../../@types/user-defined'

describe('getTeams', () => {
  it('returns a list of team items', async () => {
    const teamResponse = {
      providers: providerTeamSummaryFactory.buildList(2),
    }

    const providerService = { getTeams: jest.fn(() => teamResponse) } as unknown as ProviderService

    const getTeamParams: GetProvidersAndTeamsParams = {
      providerCode: '1',
      teamCode: '1234',
      response: {
        locals: {
          user: {
            username: 'username',
          },
        },
      } as Response,
      providerService,
    }
    const teamItems = [
      { value: '1', text: 'Team 1' },
      { value: '2', text: 'Team 2' },
    ]
    jest.spyOn(GovUkSelectInput, 'getOptions').mockReturnValue(teamItems)

    const result = await getTeams(getTeamParams)

    expect(result).toEqual(teamItems)
    expect(GovUkSelectInput.getOptions).toHaveBeenCalledWith(
      teamResponse.providers,
      'name',
      'code',
      'Choose team',
      '1234',
    )
  })

  it('returns empty if provider code is empty', async () => {
    const providerService = { getTeams: jest.fn } as unknown as ProviderService

    const getTeamParams: GetProvidersAndTeamsParams = {
      teamCode: '1234',
      response: {
        locals: {
          user: {
            username: 'username',
          },
        },
      } as Response,
      providerService,
    }

    const result = await getTeams(getTeamParams)
    expect(result).toEqual([{ value: '', text: 'Choose a region' }])
  })
})
