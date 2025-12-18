import type { Request, RequestHandler, Response } from 'express'
import SessionService from '../services/sessionService'
import DateTimeFormats from '../utils/dateTimeUtils'
import paths from '../paths'

export default class indexController {
  private readonly providerCode = 'N56'

  private readonly teamCode = 'N56DTX'

  constructor(private readonly sessionService: SessionService) {}

  index(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const request = {
        username: res.locals.user.username,
        teamCode: this.teamCode,
        providerCode: this.providerCode,
      }

      const sessionData = await this.sessionService.getNextSessions(request)

      if (!sessionData) {
        return res.render('pages/index')
      }

      const sessions = sessionData.allocations
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
