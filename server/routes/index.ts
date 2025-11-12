import { Router } from 'express'

import type { Services } from '../services'
import { Page } from '../services/auditService'
import { Controllers } from '../controllers'
import sessionRoutes from './session'

export default function routes(controllers: Controllers, { auditService }: Services): Router {
  const router = Router()

  const { sessionsController } = controllers

  router.get('/', async (req, res, next) => {
    await auditService.logPageView(Page.INDEX_PAGE, { who: res.locals.user.username, correlationId: req.id })

    return res.render('pages/index')
  })

  sessionRoutes(sessionsController, router)

  return router
}
