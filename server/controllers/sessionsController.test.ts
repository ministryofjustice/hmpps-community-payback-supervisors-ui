import { DeepMocked, createMock } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import SessionsController from './sessionsController'
import SessionService from '../services/sessionService'
import sessionFactory from '../testutils/factories/sessionFactory'

describe('SessionsController', () => {
  const request: DeepMocked<Request> = createMock<Request>({})
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  let sessionsController: SessionsController
  const sessionService = createMock<SessionService>()

  beforeEach(() => {
    sessionsController = new SessionsController(sessionService)
  })

  describe('show', () => {
    it('should render the session page', async () => {
      const session = sessionFactory.build()

      sessionService.getSession.mockResolvedValue(session)

      const requestHandler = sessionsController.show()
      const response = createMock<Response>()

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('sessions/show', {
        session,
      })
    })
  })
})
