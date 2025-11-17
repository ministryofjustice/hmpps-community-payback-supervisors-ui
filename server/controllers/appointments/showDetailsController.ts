import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import { GetAppointmentRequest } from '../../@types/user-defined'
import paths from '../../paths'
import AppointmentShowDetailsPage from '../../pages/appointments/appointmentShowDetailsPage'

export default class ShowDetailsController {
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

      const page = new AppointmentShowDetailsPage()

      res.render('appointments/show', {
        ...page.viewData(appointment),
        arrivedPath: paths.appointments.startTime({ projectCode, appointmentId }),
      })
    }
  }
}
