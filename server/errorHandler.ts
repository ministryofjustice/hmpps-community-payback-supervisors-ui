import type { Request, Response, NextFunction } from 'express'
import { HTTPError } from 'superagent'
import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import logger from '../logger'
import { getErrorStatus } from './utils/errorUtils'

export default function createErrorHandler(production: boolean) {
  // next() is not used here but is required for the middleware to be discovered
  return (error: HTTPError | SanitisedError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`, error)

    const errorStatus = getErrorStatus(error)

    if (errorStatus === 401 || errorStatus === 403) {
      logger.info('Logging user out')
      return res.redirect('/sign-out')
    }

    if (production) {
      if (errorStatus === 404) {
        res.status(404)
        return res.render('pages/404')
      }
      if (errorStatus === 500) {
        res.status(500)
        return res.render('pages/500')
      }
    }

    res.locals.message = production
      ? 'Something went wrong. The error has been logged. Please try again'
      : error.message
    res.locals.status = errorStatus
    res.locals.stack = production ? null : error.stack

    res.status(errorStatus || 500)

    return res.render('pages/error')
  }
}
