import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import AbleToWorkPage from '../../pages/appointments/update/ableToWorkPage'
import generateErrorSummary from '../../utils/errorUtils'

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

      const page = new AbleToWorkPage()

      res.render('appointments/update/ableToWork', page.viewData(appointment))
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

      const page = new AbleToWorkPage(_req.body)
      page.validate()

      if (page.hasErrors) {
        return res.render('appointments/update/ableToWork', {
          ...page.viewData(appointment),
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      return res.redirect(page.nextPath(appointmentId, projectCode))
    }
  }
}
