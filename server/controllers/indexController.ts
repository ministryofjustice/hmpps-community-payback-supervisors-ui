import type { Request, RequestHandler, Response } from 'express'
import SessionService from '../services/sessionService'
import DateTimeFormats from '../utils/dateTimeUtils'
import paths from '../paths'
import SupervisorService from '../services/supervisorService'

export default class indexController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly supervisorService: SupervisorService,
  ) {}

  index(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { username } = res.locals.user
      const supervisor = await this.supervisorService.getSupervisor(username)
      const sessionResponse = await this.sessionService.getNextSessions(username, supervisor)

      if (!sessionResponse) {
        return res.render('pages/index')
      }

      const sessions = sessionResponse
        .filter(session => session !== null)
        .sort((a, b) => {
          return +DateTimeFormats.isoToDateObj(a.date) - +DateTimeFormats.isoToDateObj(b.date)
        })
        .map(session => {
          return {
            ...session,
            date: DateTimeFormats.isoDateToUIDate(session.date, { format: 'dashed' }),
            formattedDate: DateTimeFormats.isoDateToUIDate(session.date, { format: 'medium' }),
            path: paths.sessions.show({ ...session }),
          }
        })

      return res.render('pages/index', {
        sessions,
      })
    }
  }
}
