import { Router } from 'express'
import paths from '../paths'
import SessionsController from '../controllers/sessionsController'

export default function sessionRoutes(sessionsController: SessionsController, router: Router): Router {
  router.get(paths.sessions.show.pattern, async (req, res, next) => {
    const handler = sessionsController.show()
    await handler(req, res, next)
  })

  return router
}
