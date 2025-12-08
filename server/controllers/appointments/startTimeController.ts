import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import StartTimePage from '../../pages/appointments/update/startTimePage'
import generateErrorSummary from '../../utils/errorUtils'
import { AppointmentArrivedAction } from '../../@types/user-defined'
import AppointmentStatusService from '../../services/appointmentStatusService'

export default class StartTimeController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentStatusService: AppointmentStatusService,
  ) {}

  show(action: AppointmentArrivedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new StartTimePage(action)

      res.render('appointments/update/time', page.viewData(appointment))
    }
  }

  submit(action: AppointmentArrivedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params
      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new StartTimePage(action, _req.body)
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

      if (action === 'absent') {
        this.appointmentStatusService.updateStatus(appointment, 'Absent', res.locals.user.name)
      }

      return res.redirect(page.nextPath(appointmentId, projectCode))
    }
  }
}
