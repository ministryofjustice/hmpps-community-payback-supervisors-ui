import { DeepMocked, createMock } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'
import PersonDetailsController from './personDetailsController'
import AppointmentService from '../../services/appointmentService'
import appointmentFactory from '../../testutils/factories/appointmentFactory'
import paths from '../../paths'

describe('PersonDetailsController', () => {
  const projectCode = '123'
  const appointmentId = '234'
  const request: DeepMocked<Request> = createMock<Request>({ params: { projectCode, appointmentId } })
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})

  let personDetailsController: PersonDetailsController
  const appointmentService = createMock<AppointmentService>()

  beforeEach(() => {
    personDetailsController = new PersonDetailsController(appointmentService)
  })

  describe('show', () => {
    it('should render the view person details page', async () => {
      const appointment = appointmentFactory.build()

      appointmentService.getAppointment.mockResolvedValue(appointment)

      const requestHandler = personDetailsController.show()
      const response = createMock<Response>()

      await requestHandler(request, response, next)

      expect(response.render).toHaveBeenCalledWith('appointments/show', {
        appointment,
        arrivedPath: paths.appointments.startTime({ projectCode, appointmentId }),
      })
    })
  })
})
