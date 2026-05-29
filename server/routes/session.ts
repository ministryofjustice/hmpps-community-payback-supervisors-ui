import { Router } from 'express'
import paths from '../paths'
import SessionsController from '../controllers/sessionsController'
import { Page } from '../services/auditService'
import { actions } from './utils'

export default function sessionRoutes(sessionsController: SessionsController, router: Router): Router {
  const { get, post } = actions(router)

  get(paths.sessions.show.pattern, sessionsController.show(), {
    auditEvent: Page.VIEW_NEXT_SESSIONS,
  })

  get(paths.sessions.clearSessionStatuses.pattern, sessionsController.confirmClearSession(), {
    auditEvent: Page.VIEW_DEV_CLEAR_SESSION_STATUSES,
  })

  post(paths.sessions.clearSessionStatuses.pattern, sessionsController.clearSessions(), {
    auditEvent: Page.EDIT_DEV_CLEAR_SESSION_STATUSES,
  })

  return router
}
