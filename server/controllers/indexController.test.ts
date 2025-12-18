import { DeepMocked, createMock } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import SessionService from '../services/sessionService'
import DateTimeFormats from '../utils/dateTimeUtils'
import paths from '../paths'
import IndexController from './indexController'
import sessionSummaryFactory from '../testutils/factories/sessionSummaryFactory'
import { SessionSummariesDto } from '../@types/user-defined'

describe('IndexController', () => {
  const request: DeepMocked<Request> = createMock<Request>({})
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  let indexController: IndexController
  const sessionService = createMock<SessionService>()

  beforeEach(() => {
    indexController = new IndexController(sessionService)
  })

  describe('index', () => {
    it('should render the index page', async () => {
      const sessionData = {
        allocations: [sessionSummaryFactory.build(), sessionSummaryFactory.build()],
      } as SessionSummariesDto

      sessionService.getNextSessions.mockResolvedValue(sessionData)

      const requestHandler = indexController.index()
      const response = createMock<Response>()

      await requestHandler(request, response, next)

      const sessions = sessionData.allocations
        .sort((a, b) => {
          return +DateTimeFormats.isoToDateObj(a.date) - +DateTimeFormats.isoToDateObj(b.date)
        })
        .map(session => {
          return {
            ...session,
            date: DateTimeFormats.isoDateToUIDate(session.date, { format: 'dashed' }),
            formattedDate: DateTimeFormats.isoDateToUIDate(session.date, { format: 'medium' }),
            path: paths.sessions.show({ ...session }),
          }
        })

      expect(response.render).toHaveBeenCalledWith('pages/index', {
        sessions,
      })
    })
  })
})
