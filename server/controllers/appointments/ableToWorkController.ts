import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'

export default class AbleToWorkController {
  constructor(private readonly appointmentService: AppointmentService) {}

  show(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      res.render('appointments/update/ableToWork', appointment)
    }
  }
}
