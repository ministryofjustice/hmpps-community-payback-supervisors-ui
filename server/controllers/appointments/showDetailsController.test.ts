import { DeepMocked, createMock } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import ShowDetailsController from './showDetailsController'
import AppointmentService from '../../services/appointmentService'
import appointmentFactory from '../../testutils/factories/appointmentFactory'
import AppointmentShowDetailsPage from '../../pages/appointments/appointmentShowDetailsPage'

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

  beforeEach(() => {
    showDetailsController = new ShowDetailsController(appointmentService)
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

      const requestHandler = showDetailsController.show()
      const response = createMock<Response>()

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('appointments/show', viewData)
    })
  })
})
