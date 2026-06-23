import { Router } from 'express'
import paths from '../paths'
import SessionsController from '../controllers/sessionsController'
import { Page } from '../services/auditService'
import { actions } from './utils'

export default function sessionRoutes(sessionsController: SessionsController, router: Router): Router {
  const { get } = actions(router)

  get(paths.sessions.show.pattern, sessionsController.show(), {
    auditEvent: Page.VIEW_NEXT_SESSIONS,
  })

  return router
}
