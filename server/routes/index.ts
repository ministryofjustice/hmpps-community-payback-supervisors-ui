import { Router } from 'express'
import { Page } from '../services/auditService'
import sessionRoutes from './session'
import appointmentRoutes from './appointment'
import type { Controllers } from '../controllers'
import staticRoutes from './static'
import { actions } from './utils'

export default function routes(controllers: Controllers): Router {
  const router = Router()

  const { get } = actions(router)

  const { indexController, sessionsController, staticController } = controllers

  get('/', indexController.index(), {
    auditEvent: Page.VIEW_INDEX_PAGE,
  })

  staticRoutes(staticController, router)
  sessionRoutes(sessionsController, router)
  appointmentRoutes(controllers, router)

  return router
}
