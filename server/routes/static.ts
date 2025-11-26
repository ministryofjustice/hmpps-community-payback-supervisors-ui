/* istanbul ignore file */

import type { Router } from 'express'

import paths from '../paths/static'
import StaticController from '../controllers/staticController'

export default function staticRoutes(staticController: StaticController, router: Router): Router {
  router.get(paths.static.cookiesPolicy.pattern, staticController.cookiesPolicyPage())

  return router
}
