/* istanbul ignore file */

import type { Router } from 'express'

import paths from '../paths/static'
import StaticController from '../controllers/staticController'
import AuditService, { Page } from '../services/auditService'

export default function staticRoutes(
  staticController: StaticController,
  router: Router,
  auditService: AuditService,
): Router {
  router.get(paths.static.cookiesPolicy.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.COOKIES_POLICY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = staticController.cookiesPolicyPage()
    await handler(req, res, next)
  })

  router.get(paths.static.privacyNotice.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.PRIVACY_NOTICE_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = staticController.privacyNoticePage()
    await handler(req, res, next)
  })

  router.get(paths.static.accessibilityStatement.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.ACCESSIBILITY_STATEMENT_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = staticController.accessibilityStatementPage()
    await handler(req, res, next)
  })

  return router
}
