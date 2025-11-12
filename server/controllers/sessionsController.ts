import type { Request, RequestHandler, Response } from 'express'
import SessionService from '../services/sessionService'

export default class SessionsController {
  constructor(private readonly sessionService: SessionService) {}

  show(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, date } = _req.params

      const request = {
        username: res.locals.user.username,
        projectCode,
        date: date.toString(),
      }

      const session = await this.sessionService.getSession(request)

      res.render('sessions/show', {
        session,
      })
    }
  }
}
