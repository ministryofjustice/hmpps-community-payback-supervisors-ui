import { createMock } from '@golevelup/ts-jest'
import { Request, Response } from 'express'
import { path } from 'static-path'
import logger from '../../logger'

jest.mock('../../logger')

const username = 'some-username'
const requestParams = { param1: 'value-1', param2: 'value-2' }
const auditEvent = 'SOME_AUDIT_EVENT'

const auditClient = {
  sendAuditMessage: jest.fn(),
}

jest.mock('../data', () => ({
  dataAccess: () => ({
    auditClient,
  }),
}))

/* eslint-disable import/first */
import { auditMiddleware } from './auditMiddleware'

describe('auditMiddleware', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns the given request handler when no audit events are specified', async () => {
    const handler = jest.fn()

    const auditedhandler = auditMiddleware(handler)

    expect(auditedhandler).toEqual(handler)
  })

  it('returns an audited request handler, that forwards call on to the given request handler', async () => {
    const handler = jest.fn()
    const response = createMock<Response>({ locals: { user: { username } } })
    const request = createMock<Request>()
    const next = jest.fn()

    const auditedhandler = auditMiddleware(handler, { auditEvent })

    await auditedhandler(request, response, next)

    expect(handler).toHaveBeenCalled()
  })

  it('returns an audited request handler, that redirects to /authError if there is no user UUID', async () => {
    const handler = jest.fn()
    const response = createMock<Response>({ locals: { user: {} } })
    const request = createMock<Request>()
    const next = jest.fn()

    const auditedhandler = auditMiddleware(handler, { auditEvent })

    await auditedhandler(request, response, next)

    expect(handler).not.toHaveBeenCalled()
    expect(response.redirect).toHaveBeenCalledWith('/authError')
    expect(logger.error).toHaveBeenCalledWith('User without a username is attempt to access an audited path')
  })

  it('returns an audited request handler, that sends an audit message that includes the request parameters', async () => {
    const handler = jest.fn()
    const response = createMock<Response>({ locals: { user: { username } } })
    const request = createMock<Request>({ params: requestParams })
    const next = jest.fn()

    const auditedhandler = auditMiddleware(handler, { auditEvent })

    await auditedhandler(request, response, next)

    expect(handler).toHaveBeenCalled()
    expect(auditClient.sendAuditMessage).toHaveBeenCalledWith({
      action: auditEvent,
      username,
      details: requestParams,
      correlationId: request.id,
    })
  })

  it('returns an audited request handler, that sends no audit message and throws and error if the handler returns an error', async () => {
    const handler = jest.fn()
    const response = createMock<Response>({ locals: { user: { username } } })
    const request = createMock<Request>({ params: requestParams })
    const next = jest.fn()

    const auditedhandler = auditMiddleware(handler, { auditEvent })

    handler.mockImplementation((_req, _res, handlerNext) => handlerNext('some-error'))

    await expect(() => auditedhandler(request, response, next)).rejects.toEqual('some-error')

    expect(handler).toHaveBeenCalled()
    expect(auditClient.sendAuditMessage).not.toHaveBeenCalled()
  })

  it('returns an audited request handler, that sends an audit message that includes selected request body parameters', async () => {
    const handler = jest.fn()
    const response = createMock<Response>({ locals: { user: { username } } })
    const request = createMock<Request>({
      params: requestParams,
      body: { bodyParam1: 'body-value-1', bodyParam2: 'body-value-2', bodyParam3: 'body-value-3' },
    })
    const next = jest.fn()

    const auditedhandler = auditMiddleware(handler, {
      auditEvent,
      auditBodyParams: ['bodyParam1', 'bodyParam2'],
    })

    await auditedhandler(request, response, next)

    expect(handler).toHaveBeenCalled()
    expect(auditClient.sendAuditMessage).toHaveBeenCalledWith({
      action: auditEvent,
      username,
      details: {
        ...requestParams,
        bodyParam1: 'body-value-1',
        bodyParam2: 'body-value-2',
      },
      correlationId: request.id,
    })
  })

  it('ignores empty request body parameters', async () => {
    const handler = jest.fn()
    const response = createMock<Response>({ locals: { user: { username } } })
    const request = createMock<Request>({
      params: requestParams,
      body: { bodyParam1: 'body-value-1', bodyParam2: '' },
    })
    const next = jest.fn()

    const auditedhandler = auditMiddleware(handler, {
      auditEvent,
      auditBodyParams: ['bodyParam1', 'bodyParam2'],
    })

    await auditedhandler(request, response, next)

    expect(handler).toHaveBeenCalled()
    expect(auditClient.sendAuditMessage).toHaveBeenCalledWith({
      action: auditEvent,
      username,
      details: {
        ...requestParams,
        bodyParam1: 'body-value-1',
      },
      correlationId: request.id,
    })
  })

  it('includes additional metadata if provided', async () => {
    const handler = jest.fn()
    const response = createMock<Response>({ locals: { user: { username } } })
    const request = createMock<Request>({
      params: requestParams,
    })
    const next = jest.fn()

    const auditedhandler = auditMiddleware(handler, {
      auditEvent,
      additionalMetadata: { foo: 'bar' },
    })

    await auditedhandler(request, response, next)

    expect(handler).toHaveBeenCalled()
    expect(auditClient.sendAuditMessage).toHaveBeenCalledWith({
      action: auditEvent,
      username,
      details: {
        ...requestParams,
        foo: 'bar',
      },
      correlationId: request.id,
    })
  })

  it('returns an audited request handler, that sends an audit message based on the redirect destination of the given request handler', async () => {
    const somePath = path('/').path('premises').path(':premisesId').path('room').path(':roomId')

    const handler = jest.fn()
    const response = createMock<Response>({
      locals: { user: { username } },
      get: field => {
        return field === 'Location' ? somePath({ premisesId: 'some-premises', roomId: 'some-room' }) : undefined
      },
    })
    const request = createMock<Request>()
    const next = jest.fn()

    const auditedhandler = auditMiddleware(handler, {
      redirectAuditEventSpecs: [{ auditEvent, path: somePath.pattern }],
    })

    await auditedhandler(request, response, next)

    expect(handler).toHaveBeenCalled()
    expect(auditClient.sendAuditMessage).toHaveBeenCalledWith({
      action: auditEvent,
      username,
      details: {
        premisesId: 'some-premises',
        roomId: 'some-room',
      },
      correlationId: request.id,
    })
  })

  it('sends an audit message only for the first matching RedirectAuditEventSpec', async () => {
    const nonMatchingPath = path('/').path('some-path-component')
    const matchingPath1 = path('/').path('premises').path(':premisesId').path('room').path('new')
    const matchingPath2 = path('/').path('premises').path(':premisesId').path('room').path(':roomId')

    const handler = jest.fn()
    const response = createMock<Response>({
      locals: { user: { username } },
      get: field => {
        return field === 'Location' ? matchingPath1({ premisesId: 'some-premises' }) : undefined
      },
    })
    const request = createMock<Request>()
    const next = jest.fn()

    const auditedhandler = auditMiddleware(handler, {
      redirectAuditEventSpecs: [
        { auditEvent: 'NON_MATCHING_PATH_AUDIT_EVENT', path: nonMatchingPath.pattern },
        { auditEvent: 'MATCHING_PATH_1_AUDIT_EVENT', path: matchingPath1.pattern },
        { auditEvent: 'MATCHING_PATH_2_AUDIT_EVENT', path: matchingPath2.pattern },
      ],
    })

    await auditedhandler(request, response, next)

    expect(handler).toHaveBeenCalled()
    expect(auditClient.sendAuditMessage).toHaveBeenCalledWith({
      action: 'MATCHING_PATH_1_AUDIT_EVENT',
      username,
      details: {
        premisesId: 'some-premises',
      },
      correlationId: request.id,
    })
  })

  it('includes additional metadata if provided, as part of the audit message based on the redirect destination', async () => {
    const somePath = path('/').path('premises').path(':premisesId').path('room').path(':roomId')

    const handler = jest.fn()
    const response = createMock<Response>({
      locals: { user: { username } },
      get: field => {
        return field === 'Location' ? somePath({ premisesId: 'some-premises', roomId: 'some-room' }) : undefined
      },
    })
    const request = createMock<Request>()
    const next = jest.fn()

    const auditedhandler = auditMiddleware(handler, {
      additionalMetadata: { foo: 'bar' },
      redirectAuditEventSpecs: [{ auditEvent, path: somePath.pattern }],
    })

    await auditedhandler(request, response, next)

    expect(handler).toHaveBeenCalled()
    expect(auditClient.sendAuditMessage).toHaveBeenCalledWith({
      action: auditEvent,
      username,
      details: {
        premisesId: 'some-premises',
        roomId: 'some-room',
        foo: 'bar',
      },
      correlationId: request.id,
    })
  })

  it('includes subjectType and subjectId if provided in the response and sends these as part of the audit message', async () => {
    const handler = jest.fn()
    const response = createMock<Response>({
      locals: { user: { username }, audit: { subjectType: 'CRN', subjectId: 'X12345' } },
    })
    const request = createMock<Request>({
      params: requestParams,
    })
    const next = jest.fn()

    const auditedhandler = auditMiddleware(handler, {
      auditEvent,
    })

    await auditedhandler(request, response, next)

    expect(handler).toHaveBeenCalled()
    expect(auditClient.sendAuditMessage).toHaveBeenCalledWith({
      action: auditEvent,
      username,
      details: {
        ...requestParams,
      },
      correlationId: request.id,
      subjectType: 'CRN',
      subjectId: 'X12345',
    })
  })
})
