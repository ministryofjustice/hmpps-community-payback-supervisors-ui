import type { Request, RequestHandler, Response } from 'express'
import SessionService from '../services/sessionService'
import DateTimeFormats from '../utils/dateTimeUtils'
import paths from '../paths'
import SupervisorService from '../services/supervisorService'
import config from '../config'
import ProviderService from '../services/providerService'
import getProvidersAndTeams from './shared/getProvidersAndTeams'
import SessionIndexPage from '../pages/sessions/sessionIndexPage'
import { SessionIndexPageInput } from '../@types/user-defined'

export default class indexController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly supervisorService: SupervisorService,
    private readonly providerService: ProviderService,
  ) {}

  index(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { username } = res.locals.user
      const supervisor = await this.supervisorService.getSupervisor(username)

      if (config.featureFlags.sessionsFiltersEnabled) {
        const providerCode = _req.query.provider?.toString() || undefined
        const providersAndTeams = await getProvidersAndTeams({
          providerService: this.providerService,
          providerCode,
          response: res,
        })

        return res.render('pages/index', {
          form: providersAndTeams,
          searchPath: paths.sessions.search({}),
          sessionsFiltersEnabled: config.featureFlags.sessionsFiltersEnabled,
        })
      }

      const sessionResponse = await this.sessionService.getNextSessions(username, supervisor)

      if (!sessionResponse) {
        return res.render('pages/index')
      }

      const sessions = sessionResponse.map(session => {
        return {
          ...session,
          date: DateTimeFormats.isoDateToUIDate(session.date, { format: 'dashed' }),
          formattedDate: DateTimeFormats.isoDateToUIDate(session.date, { format: 'medium' }),
          path: paths.sessions.show({ ...session }),
        }
      })

      return res.render('pages/index', {
        sessions,
        sessionsFiltersEnabled: config.featureFlags.sessionsFiltersEnabled,
      })
    }
  }

  search(): RequestHandler {
    return async (req: Request, res: Response) => {
      const { username } = res.locals.user
      const query = { ...req.query } as SessionIndexPageInput
      const { date } = req.query
      const providerCode = req.query.provider?.toString() || undefined
      const teamCode = req.query.team?.toString() || undefined
      const indexPage = new SessionIndexPage(query)

      const { provider, providerItems, teamItems } = await getProvidersAndTeams({
        providerService: this.providerService,
        providerCode,
        response: res,
        teamCode,
      })

      // Add validation heres

      const sessionResponse = await this.sessionService.getFilteredSessions(username, teamCode, date.toString())

      const sessions = sessionResponse.map(session => {
        return {
          ...session,
          date: DateTimeFormats.isoDateToUIDate(session.date, { format: 'dashed' }),
          formattedDate: DateTimeFormats.isoDateToUIDate(session.date, { format: 'medium' }),
          path: paths.sessions.show({ ...session }),
        }
      })

      return res.render('pages/index', {
        form: {
          ...indexPage.items(),
          providerItems,
          provider,
          teamItems,
        },
        searchPath: paths.sessions.search({}),
        sessions,
        showNoResultsMessage: sessions.length === 0,
        sessionsFiltersEnabled: config.featureFlags.sessionsFiltersEnabled,
      })
    }
  }
}
