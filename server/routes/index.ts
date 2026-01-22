import { Router } from 'express'

import type { Services } from '../services'
import { Page } from '../services/auditService'
import sessionRoutes from './session'
import appointmentRoutes from './appointment'
import type { Controllers } from '../controllers'
import staticRoutes from './static'

export default function routes(controllers: Controllers, { auditService }: Services): Router {
  const router = Router()

  const { indexController, sessionsController, staticController } = controllers

  router.get('/', async (req, res, next) => {
    await auditService.logPageView(Page.INDEX_PAGE, { who: res.locals.user.username, correlationId: req.id })

    const handler = indexController.index()
    await handler(req, res, next)
  })

  staticRoutes(staticController, router, auditService)
  sessionRoutes(sessionsController, router, auditService)
  appointmentRoutes(controllers, router, auditService)

  return router
}
