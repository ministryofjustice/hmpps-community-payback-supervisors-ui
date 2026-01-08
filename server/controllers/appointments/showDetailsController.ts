import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import { GetAppointmentRequest } from '../../@types/user-defined'
import AppointmentShowDetailsPage from '../../pages/appointments/appointmentShowDetailsPage'
import AppointmentStatusService from '../../services/appointmentStatusService'

export default class ShowDetailsController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentStatusService: AppointmentStatusService,
  ) {}

  show(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { appointmentId, projectCode } = _req.params

      const request: GetAppointmentRequest = {
        username: res.locals.user.username,
        projectCode,
        appointmentId,
      }

      const appointment = await this.appointmentService.getAppointment(request)
      const appointmentStatus = await this.appointmentStatusService.getStatus(appointment, res.locals.user.name)

      const page = new AppointmentShowDetailsPage()

      res.render('appointments/show', page.viewData(appointment, appointmentStatus))
    }
  }
}
