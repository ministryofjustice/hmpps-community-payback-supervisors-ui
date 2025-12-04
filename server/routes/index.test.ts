import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import SessionService from '../services/sessionService'
import IndexController from '../controllers/indexController'
import StaticController from '../controllers/staticController'

jest.mock('../services/auditService')
jest.mock('../services/exampleService')
jest.mock('../services/sessionService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const sessionService = new SessionService(null) as jest.Mocked<SessionService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
    },
    controllers: {
      indexController: new IndexController(sessionService),
      staticController: new StaticController() as jest.Mocked<StaticController>,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    auditService.logPageView.mockResolvedValue(null)
    sessionService.getNextSessions.mockImplementation(() => null)

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Next session')
        expect(sessionService.getNextSessions).toHaveBeenCalledWith({ username: 'user1', supervisorCode: 'N56A108' })
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.INDEX_PAGE, {
          who: user.username,
          correlationId: expect.any(String),
        })
      })
  })
})
