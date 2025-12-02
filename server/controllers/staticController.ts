import type { Request, RequestHandler, Response } from 'express'

export default class StaticController {
  cookiesPolicyPage(): RequestHandler {
    return (_req: Request, res: Response) => {
      res.render('static/cookies-policy')
    }
  }

  privacyNoticePage(): RequestHandler {
    return (_req: Request, res: Response) => {
      res.render('static/privacy-notice')
    }
  }

  accessibilityStatementPage(): RequestHandler {
    return (_req: Request, res: Response) => {
      res.render('static/accessibility-statement')
    }
  }
}
