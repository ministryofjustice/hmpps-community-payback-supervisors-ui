import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import generateErrorSummary from '../../utils/errorUtils'
import { AppointmentCompletedAction } from '../../@types/user-defined'
import EndTimePage from '../../pages/appointments/update/endTimePage'

export default class EndTimeController {
  constructor(private readonly appointmentService: AppointmentService) {}

  show(action: AppointmentCompletedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new EndTimePage(action)

      res.render('appointments/update/time', page.viewData(appointment))
    }
  }

  submit(action: AppointmentCompletedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params
      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new EndTimePage(action, _req.body)
      page.validate(appointment)

      if (page.hasErrors) {
        return res.render('appointments/update/time', {
          ...page.viewData(appointment),
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
