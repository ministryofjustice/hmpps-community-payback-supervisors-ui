import { DeepMocked, createMock } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import SessionService from '../services/sessionService'
import DateTimeFormats from '../utils/dateTimeUtils'
import paths from '../paths'
import IndexController from './indexController'
import sessionSummaryFactory from '../testutils/factories/sessionSummaryFactory'
import SupervisorService from '../services/supervisorService'
import supervisorFactory from '../testutils/factories/supervisorFactory'
import HtmlUtils from '../utils/htmlUtils'
import config from '../config'
import ProviderService from '../services/providerService'
import providerSummaryFactory from '../testutils/factories/providerSummaryFactory'
import GovUkSelectInput from '../forms/GovUkSelectInput'

describe('IndexController', () => {
  const request: DeepMocked<Request> = createMock<Request>({})
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  let indexController: IndexController
  const sessionService = createMock<SessionService>()
  const supervisorService = createMock<SupervisorService>()
  const providerService = createMock<ProviderService>()

  beforeEach(() => {
    indexController = new IndexController(sessionService, supervisorService, providerService)
    jest.clearAllMocks()
  })

  describe('index', () => {
    it('renders the index page with filters when sessionsFiltersEnabled is enabled', async () => {
      config.featureFlags.sessionsFiltersEnabled = true

      const providers = providerSummaryFactory.buildList(2)
      providerService.getProviders.mockResolvedValue(providers)

      const req: DeepMocked<Request> = createMock<Request>({ query: {} })
      const response = createMock<Response>()

      const requestHandler = indexController.index()
      await requestHandler(req, response, next)

      expect(response.render).toHaveBeenCalledWith('pages/index', {
        form: {
          teamItems: [{ value: '', text: 'Choose a region' }],
          provider: undefined,
          providerItems: GovUkSelectInput.getOptions(providers, 'name', 'code', 'Choose region', undefined),
        },
        searchPath: paths.sessions.search({}),
        sessionsFiltersEnabled: config.featureFlags.sessionsFiltersEnabled,
      })
    })

    it('should render the previous index page when sessionsFiltersEnabled is disabled', async () => {
      config.featureFlags.sessionsFiltersEnabled = false
      const supervisor = supervisorFactory.build()
      const sessionResult = sessionSummaryFactory.buildList(2)

      supervisorService.getSupervisor.mockResolvedValue(supervisor)
      sessionService.getNextSessions.mockResolvedValue(sessionResult)

      const requestHandler = indexController.index()
      const response = createMock<Response>()

      const hiddenText = 'hidden text'
      jest.spyOn(HtmlUtils, 'getHiddenText').mockReturnValue(hiddenText)

      await requestHandler(request, response, next)

      const sessions = sessionResult.map(session => {
        return {
          ...session,
          date: DateTimeFormats.isoDateToUIDate(session.date, { format: 'dashed' }),
          formattedDate: DateTimeFormats.isoDateToUIDate(session.date, { format: 'medium' }),
          path: paths.sessions.show({ ...session }),
          linkHtmlContent: `View${hiddenText}`,
        }
      })

      expect(response.render).toHaveBeenCalledWith('pages/index', {
        sessions,
        sessionsFiltersEnabled: config.featureFlags.sessionsFiltersEnabled,
      })
    })
  })

  describe('search', () => {
    it('renders the index page with results when sessionsFiltersEnabled is enabled', async () => {
      config.featureFlags.sessionsFiltersEnabled = true

      const providers = providerSummaryFactory.buildList(2)
      providerService.getProviders.mockResolvedValue(providers)

      const teams = [
        { code: 'TEAM1', name: 'Team 1' },
        { code: 'TEAM2', name: 'Team 2' },
      ]
      providerService.getTeams.mockResolvedValue({ providers: teams } as never)

      const sessionResult = sessionSummaryFactory.buildList(2)
      sessionService.getFilteredSessions.mockResolvedValue(sessionResult)

      const req: DeepMocked<Request> = createMock<Request>({
        query: { provider: 'PROVIDER1', team: 'TEAM1', date: '17/5/2024' },
      })
      const response = createMock<Response>({ locals: { user: { username: 'supervisor1' } } })

      const hiddenText = 'hidden text'
      jest.spyOn(HtmlUtils, 'getHiddenText').mockReturnValue(hiddenText)

      const requestHandler = indexController.search()
      await requestHandler(req, response, next)

      const sessions = sessionResult.map(session => ({
        ...session,
        date: DateTimeFormats.isoDateToUIDate(session.date, { format: 'dashed' }),
        formattedDate: DateTimeFormats.isoDateToUIDate(session.date, { format: 'medium' }),
        path: paths.sessions.show({ ...session }),
        linkHtmlContent: `View${hiddenText}`,
      }))

      expect(sessionService.getFilteredSessions).toHaveBeenCalledWith('supervisor1', 'TEAM1', '17/5/2024')
      expect(response.render).toHaveBeenCalledWith('pages/index', {
        form: {
          date: '17/5/2024',
          provider: { value: 'PROVIDER1' },
          providerItems: GovUkSelectInput.getOptions(providers, 'name', 'code', 'Choose region', 'PROVIDER1'),
          teamItems: GovUkSelectInput.getOptions(teams, 'name', 'code', 'Choose team', 'TEAM1'),
        },
        searchPath: paths.sessions.search({}),
        sessions,
        showNoResultsMessage: false,
        sessionsFiltersEnabled: true,
      })
    })
  })
})
