import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import { GetAppointmentRequest } from '../../@types/user-defined'
import paths from '../../paths'

export default class PersonDetailsController {
  constructor(private readonly appointmentService: AppointmentService) {}

  show(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { appointmentId, projectCode } = _req.params

      const request: GetAppointmentRequest = {
        username: res.locals.user.username,
        projectCode,
        appointmentId,
      }

      const appointment = await this.appointmentService.getAppointment(request)

      res.render('appointments/show', {
        appointment,
        arrivedPath: paths.appointments.startTime({ projectCode, appointmentId }),
      })
    }
  }
}
