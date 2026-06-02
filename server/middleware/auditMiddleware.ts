import { NextFunction, Request, RequestHandler, Response } from 'express'
import { Key, pathToRegexp } from 'path-to-regexp'
import logger from '../../logger'
import { dataAccess } from '../data'
import { AuditParams } from '../@types/user-defined'

export type AuditEventSpec = {
  auditEvent?: string
  auditBodyParams?: string[]
  redirectAuditEventSpecs?: RedirectAuditEventSpec[]
  additionalMetadata?: Record<string, string>
}

const { auditClient } = dataAccess()

type RedirectAuditEventSpec = { path: string; auditEvent: string }
type RedirectAuditMatcher = { keys: Key[]; auditEvent: string; regExp: RegExp }

export const auditMiddleware = (handler: RequestHandler, auditEventSpec?: AuditEventSpec) => {
  if (auditEventSpec) {
    const redirectMatchers: Array<RedirectAuditMatcher> = auditEventSpec.redirectAuditEventSpecs?.map(
      ({ path, auditEvent: redirectAuditEvent }) => {
        const parsedRegex = pathToRegexp(path)
        return { auditEvent: redirectAuditEvent, keys: parsedRegex.keys, regExp: parsedRegex.regexp }
      },
    )

    return wrapHandler(
      handler,
      auditEventSpec?.auditEvent,
      auditEventSpec?.auditBodyParams,
      auditEventSpec?.additionalMetadata,
      redirectMatchers,
    )
  }
  return handler
}

const wrapHandler =
  (
    handler: RequestHandler,
    auditEvent: string | undefined,
    auditBodyParams: string[] | undefined,
    additionalMetadata: Record<string, string> | undefined,
    redirectMatchers: RedirectAuditMatcher[] | undefined,
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectAuditEvent: string
    let redirectParams: Record<string, string>

    const userUuid = res?.locals?.user?.username

    if (!userUuid) {
      logger.error('User without a username is attempt to access an audited path')
      res.redirect('/authError')
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let handlerError: any

    await handler(req, res, error => {
      handlerError = error
    })

    if (!handlerError) {
      const encodedRedirectLocation = res.get('Location')
      if (encodedRedirectLocation && redirectMatchers) {
        const redirectPath = decodeURI(encodedRedirectLocation)
        redirectParams = {}

        redirectMatchers.some(redirectMatcher => {
          if (matchAuditEvent(redirectPath, redirectMatcher, redirectParams)) {
            redirectAuditEvent = redirectMatcher.auditEvent
            return true
          }
          return false
        })
      }

      const { subjectType, subjectId } = res.locals.audit ?? {}

      if (auditEvent) {
        const params = {
          action: auditEvent,
          username: userUuid,
          details: {
            ...auditDetails(req, auditBodyParams),
            ...additionalMetadata,
          },
          correlationId: req.id,
        } as AuditParams

        if (subjectType) params.subjectType = subjectType
        if (subjectId) params.subjectId = subjectId

        await auditClient.sendAuditMessage(params)
      }

      if (redirectAuditEvent) {
        const params = {
          action: redirectAuditEvent,
          username: userUuid,
          details: {
            ...redirectParams,
            ...additionalMetadata,
          },
          correlationId: req.id,
        } as AuditParams

        if (subjectType) params.subjectType = subjectType
        if (subjectId) params.subjectId = subjectId

        await auditClient.sendAuditMessage(params)
      }
    } else {
      throw handlerError
    }
  }

const auditDetails = (req: Request, auditBodyParams: string[] | undefined) => {
  if (!auditBodyParams) {
    return req.params
  }

  return {
    ...req.params,
    ...auditBodyParams.reduce(
      (previous, current) => (req.body[current] ? { [current]: req.body[current], ...previous } : previous),
      {},
    ),
  }
}

const matchAuditEvent = (
  path: string,
  redirectMatcher: RedirectAuditMatcher,
  redirectParams: Record<string, string>,
) => {
  const matches = redirectMatcher.regExp.exec(path)

  if (matches) {
    redirectMatcher.keys.forEach((key, i) => {
      const param = key.name
      // eslint-disable-next-line no-param-reassign
      redirectParams[param] = decodeURIComponent(matches[i + 1])
    })

    return true
  }
  return false
}
