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

      const sessionData = await this.sessionService.getNextSession(request)

      if (!sessionData) {
        return res.render('pages/index')
      }

      const nextSession = {
        ...sessionData,
        projectCode: this.projectCode,
        date: DateTimeFormats.isoDateToUIDate(sessionData.date, { format: 'dashed' }),
        formattedDate: DateTimeFormats.isoDateToUIDate(sessionData.date, { format: 'medium' }),
      }

      return res.render('pages/index', {
        session: {
          ...nextSession,
          path: paths.sessions.show({ ...nextSession }),
        },
      })
    }
  }
}
