/* istanbul ignore file */

import type { Router } from 'express'

import paths from '../paths/static'
import StaticController from '../controllers/staticController'
import { Page } from '../services/auditService'
import { actions } from './utils'

export default function staticRoutes(staticController: StaticController, router: Router): Router {
  const { get } = actions(router)

  get(paths.static.cookiesPolicy.pattern, staticController.cookiesPolicyPage(), {
    auditEvent: Page.VIEW_COOKIES_POLICY,
  })

  get(paths.static.privacyNotice.pattern, staticController.privacyNoticePage(), {
    auditEvent: Page.VIEW_PRIVACY_NOTICE,
  })

  get(paths.static.accessibilityStatement.pattern, staticController.accessibilityStatementPage(), {
    auditEvent: Page.VIEW_ACCESSIBILITY_STATEMENT,
  })

  return router
}
