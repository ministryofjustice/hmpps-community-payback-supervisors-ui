import { Router } from 'express'
import paths from '../paths'
import SessionsController from '../controllers/sessionsController'
import AuditService, { Page } from '../services/auditService'

export default function sessionRoutes(
  sessionsController: SessionsController,
  router: Router,
  auditService: AuditService,
): Router {
  router.get(paths.sessions.show.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_NEXT_SESSIONS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = sessionsController.show()
    await handler(req, res, next)
  })

  router.get(paths.sessions.clearSessionStatuses.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_DEV_CLEAR_SESSION_STATUSES, {
      who: res.locals.user.username,
      correlationId: req.id,
    })
    const handler = sessionsController.confirmClearSession()
    await handler(req, res, next)
  })

  router.post(paths.sessions.clearSessionStatuses.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SUBMIT_DEV_CLEAR_SESSION_STATUSES, {
      who: res.locals.user.username,
      correlationId: req.id,
    })
    const handler = sessionsController.clearSessions()
    await handler(req, res, next)
  })

  return router
}
