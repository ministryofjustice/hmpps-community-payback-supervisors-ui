import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import StartTimePage from '../../pages/appointments/update/startTimePage'
import generateErrorSummary from '../../utils/errorUtils'

export default class StartTimeController {
  constructor(private readonly appointmentService: AppointmentService) {}

  show(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new StartTimePage()

      res.render('appointments/update/startTime', page.viewData(appointment, projectCode))
    }
  }

  submit(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params
      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new StartTimePage(_req.body)
      page.validate()

      if (page.hasErrors) {
        return res.render('appointments/update/startTime', {
          ...page.viewData(appointment, projectCode),
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      const payload = page.requestBody(appointment)

      await this.appointmentService.saveAppointment({
        username: res.locals.user.name,
        projectCode,
        data: payload,
      })

      return res.redirect(page.nextPath(appointmentId, projectCode))
    }
  }
}
