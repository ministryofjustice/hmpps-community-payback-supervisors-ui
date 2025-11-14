import { DeepMocked, createMock } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import SessionsController from './sessionsController'
import SessionService from '../services/sessionService'
import sessionFactory from '../testutils/factories/sessionFactory'
import DateTimeFormats from '../utils/dateTimeUtils'
import LocationUtils from '../utils/locationUtils'
import Offender from '../models/offender'
import appointmentSummaryFactory from '../testutils/factories/appointmentSummaryFactory'
import paths from '../paths'

jest.mock('../models/offender')

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
      const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>
      const offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }
      offenderMock.mockImplementation(() => offender)

      const appointmentSummary = appointmentSummaryFactory.build()
      const session = sessionFactory.build({ appointmentSummaries: [appointmentSummary] })

      sessionService.getSession.mockResolvedValue(session)

      const requestHandler = sessionsController.show()
      const response = createMock<Response>()

      const date = '12 February 2025'
      jest.spyOn(DateTimeFormats, 'isoDateToUIDate').mockReturnValue(date)

      const location = '12 Hampton Road'
      jest.spyOn(LocationUtils, 'locationToParagraph').mockReturnValue(location)

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('sessions/show', {
        session: {
          ...session,
          formattedDate: date,
          formattedLocation: location,
          appointmentSummaries: [
            {
              ...appointmentSummary,
              formattedOffender: offender,
              path: paths.appointments.personDetails({
                projectCode: session.projectCode,
                appointmentId: appointmentSummary.id.toString(),
              }),
            },
          ],
        },
      })
    })
  })
})
