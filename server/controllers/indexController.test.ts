import { DeepMocked, createMock } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import SessionService from '../services/sessionService'
import DateTimeFormats from '../utils/dateTimeUtils'
import paths from '../paths'
import IndexController from './indexController'
import sessionSummaryFactory from '../testutils/factories/sessionSummaryFactory'

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
      const sessionData = sessionSummaryFactory.build()

      sessionService.getNextSession.mockResolvedValue(sessionData)

      const requestHandler = indexController.index()
      const response = createMock<Response>()

      await requestHandler(request, response, next)

      const mockedData = {
        ...sessionData,
        date: DateTimeFormats.isoDateToUIDate(sessionData.date, { format: 'dashed' }),
        formattedDate: DateTimeFormats.isoDateToUIDate(sessionData.date, { format: 'medium' }),
        projectCode: 'N56123456',
      }

      expect(response.render).toHaveBeenCalledWith('pages/index', {
        session: {
          ...mockedData,
          path: paths.sessions.show({ ...mockedData }),
        },
      })
    })
  })
})
