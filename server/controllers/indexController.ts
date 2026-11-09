import type { Request, RequestHandler, Response } from 'express'
import SessionService from '../services/sessionService'
import DateTimeFormats from '../utils/dateTimeUtils'
import paths from '../paths'
import SupervisorService from '../services/supervisorService'
import HtmlUtils from '../utils/htmlUtils'

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

      const sessions = sessionResponse.map(session => {
        const formattedDate = DateTimeFormats.isoDateToUIDate(session.date, { format: 'medium' })
        const hiddenLinkText = HtmlUtils.getHiddenText(HtmlUtils.escape(` ${session.projectName} on ${formattedDate}`))
        return {
          ...session,
          date: DateTimeFormats.isoDateToUIDate(session.date, { format: 'dashed' }),
          formattedDate,
          path: paths.sessions.show({ ...session }),
          linkHtmlContent: `View${hiddenLinkText}`,
        }
      })

      return res.render('pages/index', {
        sessions,
      })
    }
  }
}
