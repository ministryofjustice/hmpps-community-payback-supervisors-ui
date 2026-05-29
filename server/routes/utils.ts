/* istanbul ignore file */

import { type RequestHandler, Request, Response, Router, NextFunction } from 'express'
import { AuditEventSpec, auditMiddleware } from '../middleware/auditMiddleware'

export default function asyncMiddleware(fn: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

type RoutingFunction = (path: string | string[], handler: RequestHandler, auditEventSpec?: AuditEventSpec) => Router

type Actions = {
  get: RoutingFunction
  post: RoutingFunction
  put: RoutingFunction
  patch: RoutingFunction
}

export function actions(router: Router): Actions {
  return {
    get: (path: string | string[], handler: RequestHandler, auditEventSpec?: AuditEventSpec) =>
      router.get(path, asyncMiddleware(auditMiddleware(handler, auditEventSpec))),
    post: (path: string | string[], handler: RequestHandler, auditEventSpec?: AuditEventSpec) =>
      router.post(path, asyncMiddleware(auditMiddleware(handler, auditEventSpec))),
    put: (path: string | string[], handler: RequestHandler, auditEventSpec?: AuditEventSpec) =>
      router.put(path, asyncMiddleware(auditMiddleware(handler, auditEventSpec))),
    patch: (path: string | string[], handler: RequestHandler, auditEventSpec?: AuditEventSpec) =>
      router.patch(path, asyncMiddleware(auditMiddleware(handler, auditEventSpec))),
  }
}
