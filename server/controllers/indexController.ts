import type { Request, RequestHandler, Response } from 'express'
import SessionService from '../services/sessionService'
import DateTimeFormats from '../utils/dateTimeUtils'
import paths from '../paths'

export default class indexController {
  private readonly supervisorCode = 'N56A108'

  private readonly projectCode = 'N56123456'

  constructor(private readonly sessionService: SessionService) {}

  index(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const request = {
        username: res.locals.user.username,
        supervisorCode: this.supervisorCode,
      }

      const sessionData = await this.sessionService.getNextSessions(request)

      if (!sessionData) {
        return res.render('pages/index')
      }

      const sessions = sessionData
        .filter(session => session !== null)
        .sort((a, b) => {
          return +DateTimeFormats.isoToDateObj(a.date) - +DateTimeFormats.isoToDateObj(b.date)
        })
        .map(session => {
          return {
            ...session,
            projectCode: this.projectCode,
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
