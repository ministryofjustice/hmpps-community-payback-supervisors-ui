import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import IsAbleToWorkPage from '../../pages/appointments/update/isAbleToWorkPage'
import generateErrorSummary from '../../utils/errorUtils'

export default class IsAbleToWorkController {
  constructor(private readonly appointmentService: AppointmentService) {}

  show(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new IsAbleToWorkPage()

      res.render('appointments/update/isAbleToWork', page.viewData(appointment))
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

      const page = new IsAbleToWorkPage(_req.body)
      page.validate()

      if (page.hasErrors) {
        return res.render('appointments/update/isAbleToWork', {
          ...page.viewData(appointment),
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      return res.redirect(page.nextPath(appointmentId, projectCode))
    }
  }
}
