import type { Request, Response, Express } from 'express'
import type { HTTPError } from 'superagent'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import request from 'supertest'
import createErrorHandler from './errorHandler'
import { appWithAllRoutes } from './routes/testutils/appSetup'

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({})
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 404', () => {
  it('should render content with stack in dev mode', () => {
    return request(app)
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('NotFoundError: Not Found')
        expect(res.text).not.toContain('Page not found')
      })
  })

  it('should render content without stack in production mode', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
        expect(res.text).not.toContain('NotFoundError: Not Found')
      })
  })
})

describe('GET 500', () => {
  it('should render the 500 template in production mode', () => {
    const handler = createErrorHandler(true)

    const error: HTTPError = createMock<HTTPError>({
      status: 500,
    })

    const req: DeepMocked<Request> = createMock<Request>({
      originalUrl: '/somewhere',
    })

    const res: DeepMocked<Response> = createMock<Response>({
      locals: {
        user: { username: 'test-user' },
      },
      status: jest.fn(),
      render: jest.fn(),
      redirect: jest.fn(),
    })

    const next = jest.fn()

    handler(error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.render).toHaveBeenCalledWith('pages/500')
  })

  it('should fall back to 500 when no error status is present', () => {
    const handler = createErrorHandler(false)

    const error = {
      message: 'Some unknown error',
      stack: 'stack',
    } as unknown as HTTPError

    const req: DeepMocked<Request> = createMock<Request>({
      originalUrl: '/somewhere',
    })

    const res: DeepMocked<Response> = createMock<Response>({
      locals: {
        user: { username: 'test-user' },
      },
      status: jest.fn(),
      render: jest.fn(),
      redirect: jest.fn(),
    })

    const next = jest.fn()

    handler(error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.render).toHaveBeenCalledWith('pages/error')
  })
})
