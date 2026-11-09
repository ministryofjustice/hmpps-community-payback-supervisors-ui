import { DeepMocked, createMock } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'

import DataController from './dataController'
import ProviderService from '../../services/providerService'
import { GovUkSelectOption } from '../../@types/user-defined'
import getTeams from './getTeams'

jest.mock('./getTeams')

describe('DataController', () => {
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})
  const providerService = createMock<ProviderService>()
  const getTeamsMock: jest.Mock = getTeams as unknown as jest.Mock<Promise<Array<GovUkSelectOption>>>

  let dataController: DataController

  beforeEach(() => {
    jest.resetAllMocks()
    dataController = new DataController(providerService)
  })

  describe('teams', () => {
    it('should return a list of teams', async () => {
      const teams = [
        { text: 'Team 1', value: '1' },
        { text: 'Team 2', value: '2' },
      ]
      getTeamsMock.mockResolvedValueOnce(teams)

      const request = createMock<Request>({ params: { provider: 'some-provider' } })
      const response = createMock<Response>()

      const requestHandler = dataController.teams()
      await requestHandler(request, response, next)

      expect(response.send).toHaveBeenCalledWith({ teams })
    })
  })
})
