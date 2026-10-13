import { DeepMocked, createMock } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import ShowDetailsController from './showDetailsController'
import AppointmentService from '../../services/appointmentService'
import appointmentFactory from '../../testutils/factories/appointmentFactory'
import AppointmentShowDetailsPage from '../../pages/appointments/appointmentShowDetailsPage'
import ReferenceDataService from '../../services/referenceDataService'
import OffenderService from '../../services/offenderService'
import caseDetailsFactory from '../../testutils/factories/caseDetailsFactory'

jest.mock('../../pages/appointments/appointmentShowDetailsPage')

describe('ShowDetailsController', () => {
  const projectCode = '123'
  const appointmentId = '234'
  const request: DeepMocked<Request> = createMock<Request>({ params: { projectCode, appointmentId } })
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})
  const appointmentDetailsPageMock: jest.Mock =
    AppointmentShowDetailsPage as unknown as jest.Mock<AppointmentShowDetailsPage>

  let showDetailsController: ShowDetailsController
  const appointmentService = createMock<AppointmentService>()
  const referenceDataService = createMock<ReferenceDataService>()
  const offenderService = createMock<OffenderService>()

  beforeEach(() => {
    showDetailsController = new ShowDetailsController(appointmentService, referenceDataService, offenderService)
  })

  describe('show', () => {
    it('should render the view appointment details page', async () => {
      const viewData = { someKey: 'someValue' }

      appointmentDetailsPageMock.mockImplementation(() => {
        return {
          viewData: () => viewData,
        }
      })

      const appointment = appointmentFactory.build()

      appointmentService.getAppointment.mockResolvedValue(appointment)

      const caseDetails = caseDetailsFactory.build()

      offenderService.getOffenderSummary.mockResolvedValue(caseDetails)

      const requestHandler = showDetailsController.show()
      const response = createMock<Response>()

      await requestHandler(request, response, next)

      expect(response.locals.audit).toEqual({
        subjectType: 'CRN',
        subjectId: appointment.offender.crn,
      })
      expect(response.render).toHaveBeenCalledWith('appointments/show', viewData)
    })
  })
})
