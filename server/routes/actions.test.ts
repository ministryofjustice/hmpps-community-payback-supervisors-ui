import { Router } from 'express'
import actions from './actions'
import { auditMiddleware } from '../middleware/auditMiddleware'
import asyncMiddleware from './asyncMiddleware'

jest.mock('../middleware/auditMiddleware')
jest.mock('./asyncMiddleware')

describe('actions', () => {
  const router = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  } as unknown as Router

  const wrappedAuditHandler = jest.fn()
  const wrappedAsyncMiddleware = jest.fn()

  const handler = jest.fn()
  const auditEventSpec = { auditEvent: 'SEARCH' }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(auditMiddleware as jest.Mock).mockReturnValue(wrappedAuditHandler)
    ;(asyncMiddleware as jest.Mock).mockReturnValue(wrappedAsyncMiddleware)
  })

  describe('get', () => {
    it('wraps a single handler with audit and async middleware', () => {
      const { get } = actions(router)

      get('/path', handler, auditEventSpec)

      expect(auditMiddleware).toHaveBeenCalledWith(handler, auditEventSpec)
      expect(asyncMiddleware).toHaveBeenCalledWith(wrappedAuditHandler)
    })

    it('supports a single handler provided as an array', () => {
      const { get } = actions(router)

      get('/path', [handler], auditEventSpec)

      expect(auditMiddleware).toHaveBeenCalledWith(handler, auditEventSpec)
      expect(asyncMiddleware).toHaveBeenCalledWith(wrappedAuditHandler)
    })

    it('only applies audit middleware to the final handler in a middleware chain', () => {
      const { get } = actions(router)

      const firstHandler = jest.fn()
      const secondHandler = jest.fn()
      const thirdHandler = jest.fn()

      get('/path', [firstHandler, secondHandler, thirdHandler], auditEventSpec)

      expect(auditMiddleware).toHaveBeenCalledWith(thirdHandler, auditEventSpec)
      expect(asyncMiddleware).toHaveBeenNthCalledWith(1, firstHandler)
      expect(asyncMiddleware).toHaveBeenNthCalledWith(2, secondHandler)
      expect(asyncMiddleware).toHaveBeenNthCalledWith(3, wrappedAuditHandler)
    })
  })

  describe('post', () => {
    it('wraps a single handler with audit and async middleware', () => {
      const { post } = actions(router)

      post('/path', handler, auditEventSpec)

      expect(auditMiddleware).toHaveBeenCalledWith(handler, auditEventSpec)
      expect(asyncMiddleware).toHaveBeenCalledWith(wrappedAuditHandler)
    })

    it('supports a single handler provided as an array', () => {
      const { post } = actions(router)

      post('/path', [handler], auditEventSpec)

      expect(auditMiddleware).toHaveBeenCalledWith(handler, auditEventSpec)
      expect(asyncMiddleware).toHaveBeenCalledWith(wrappedAuditHandler)
    })

    it('only applies audit middleware to the final handler in a middleware chain', () => {
      const { post } = actions(router)

      const firstHandler = jest.fn()
      const secondHandler = jest.fn()
      const thirdHandler = jest.fn()

      post('/path', [firstHandler, secondHandler, thirdHandler], auditEventSpec)

      expect(auditMiddleware).toHaveBeenCalledWith(thirdHandler, auditEventSpec)
      expect(asyncMiddleware).toHaveBeenNthCalledWith(1, firstHandler)
      expect(asyncMiddleware).toHaveBeenNthCalledWith(2, secondHandler)
      expect(asyncMiddleware).toHaveBeenNthCalledWith(3, wrappedAuditHandler)
    })
  })

  describe('put', () => {
    it('wraps a single handler with audit and async middleware', () => {
      const { put } = actions(router)

      put('/path', handler, auditEventSpec)

      expect(auditMiddleware).toHaveBeenCalledWith(handler, auditEventSpec)
      expect(asyncMiddleware).toHaveBeenCalledWith(wrappedAuditHandler)
    })

    it('supports a single handler provided as an array', () => {
      const { put } = actions(router)

      put('/path', [handler], auditEventSpec)

      expect(auditMiddleware).toHaveBeenCalledWith(handler, auditEventSpec)
      expect(asyncMiddleware).toHaveBeenCalledWith(wrappedAuditHandler)
    })

    it('only applies audit middleware to the final handler in a middleware chain', () => {
      const { put } = actions(router)

      const firstHandler = jest.fn()
      const secondHandler = jest.fn()
      const thirdHandler = jest.fn()

      put('/path', [firstHandler, secondHandler, thirdHandler], auditEventSpec)

      expect(auditMiddleware).toHaveBeenCalledWith(thirdHandler, auditEventSpec)
      expect(asyncMiddleware).toHaveBeenNthCalledWith(1, firstHandler)
      expect(asyncMiddleware).toHaveBeenNthCalledWith(2, secondHandler)
      expect(asyncMiddleware).toHaveBeenNthCalledWith(3, wrappedAuditHandler)
    })
  })

  describe('patch', () => {
    it('wraps a single handler with audit and async middleware', () => {
      const { patch } = actions(router)

      patch('/path', handler, auditEventSpec)

      expect(auditMiddleware).toHaveBeenCalledWith(handler, auditEventSpec)
      expect(asyncMiddleware).toHaveBeenCalledWith(wrappedAuditHandler)
    })

    it('supports a single handler provided as an array', () => {
      const { patch } = actions(router)

      patch('/path', [handler], auditEventSpec)

      expect(auditMiddleware).toHaveBeenCalledWith(handler, auditEventSpec)
      expect(asyncMiddleware).toHaveBeenCalledWith(wrappedAuditHandler)
    })

    it('only applies audit middleware to the final handler in a middleware chain', () => {
      const { patch } = actions(router)

      const firstHandler = jest.fn()
      const secondHandler = jest.fn()
      const thirdHandler = jest.fn()

      patch('/path', [firstHandler, secondHandler, thirdHandler], auditEventSpec)

      expect(auditMiddleware).toHaveBeenCalledWith(thirdHandler, auditEventSpec)
      expect(asyncMiddleware).toHaveBeenNthCalledWith(1, firstHandler)
      expect(asyncMiddleware).toHaveBeenNthCalledWith(2, secondHandler)
      expect(asyncMiddleware).toHaveBeenNthCalledWith(3, wrappedAuditHandler)
    })
  })
})
