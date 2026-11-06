import { Router } from 'express'
import { Page } from '../services/auditService'
import sessionRoutes from './session'
import appointmentRoutes from './appointment'
import type { Controllers } from '../controllers'
import { actions } from './utils'
import paths from '../paths'

export default function routes(controllers: Controllers): Router {
  const router = Router()

  const { get } = actions(router)

  const { indexController, sessionsController } = controllers

  get('/', indexController.index(), {
    auditEvent: Page.VIEW_INDEX_PAGE,
  })

  get(paths.sessions.search.pattern, indexController.search(), {
    auditEvent: Page.VIEW_NEXT_SESSIONS,
  })

  sessionRoutes(sessionsController, router)
  appointmentRoutes(controllers, router)

  return router
}
