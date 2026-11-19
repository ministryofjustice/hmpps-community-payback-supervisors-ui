/* istanbul ignore file */

import { type RequestHandler, Router } from 'express'
import { AuditEventSpec, auditMiddleware } from '../middleware/auditMiddleware'
import asyncMiddleware from './asyncMiddleware'

type RoutingFunction = (
  path: string | string[],
  handlers: RequestHandler | RequestHandler[],
  auditEventSpec?: AuditEventSpec,
) => Router

type Actions = {
  get: RoutingFunction
  post: RoutingFunction
  put: RoutingFunction
  patch: RoutingFunction
}

const wrapHandler = (handler: RequestHandler, auditEventSpec?: AuditEventSpec) =>
  asyncMiddleware(auditMiddleware(handler, auditEventSpec))

const wrapHandlers = (handlers: RequestHandler | RequestHandler[], auditEventSpec?: AuditEventSpec) => {
  if (!Array.isArray(handlers)) {
    return [wrapHandler(handlers, auditEventSpec)]
  }

  return handlers.map((handler, index) => {
    const wrapped = index === handlers.length - 1 ? auditMiddleware(handler, auditEventSpec) : handler

    return asyncMiddleware(wrapped)
  })
}

export default function actions(router: Router): Actions {
  return {
    get: (path: string | string[], handler: RequestHandler | RequestHandler[], auditEventSpec?: AuditEventSpec) =>
      router.get(path, ...wrapHandlers(handler, auditEventSpec)),
    post: (path: string | string[], handler: RequestHandler, auditEventSpec?: AuditEventSpec) =>
      router.post(path, ...wrapHandlers(handler, auditEventSpec)),
    put: (path: string | string[], handler: RequestHandler, auditEventSpec?: AuditEventSpec) =>
      router.put(path, ...wrapHandlers(handler, auditEventSpec)),
    patch: (path: string | string[], handler: RequestHandler, auditEventSpec?: AuditEventSpec) =>
      router.patch(path, ...wrapHandlers(handler, auditEventSpec)),
  }
}
