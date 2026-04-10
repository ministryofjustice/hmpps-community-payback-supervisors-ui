import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import IsAbleToWorkPage from '../../pages/appointments/update/isAbleToWorkPage'
import { generateErrorSummary } from '../../utils/errorUtils'
import AppointmentStatusService from '../../services/appointmentStatusService'
import AppointmentFormService from '../../services/appointmentFormService'
import paths from '../../paths'
import { AppointmentParams } from '../../@types/user-defined'

export default class IsAbleToWorkController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentStatusService: AppointmentStatusService,
    private readonly appointmentFormService: AppointmentFormService,
  ) {}

  show(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params as unknown as AppointmentParams
      const formId = _req.query.form?.toString()

      if (!formId) {
        return res.redirect(paths.appointments.arrived.startTime({ projectCode, appointmentId }))
      }

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)
      const page = new IsAbleToWorkPage(formId)

      return res.render('appointments/update/isAbleToWork', page.viewData(appointment, formData))
    }
  }

  submit(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params as unknown as AppointmentParams
      const formId = _req.query.form?.toString()

      if (!formId) {
        return res.redirect(paths.appointments.arrived.startTime({ projectCode, appointmentId }))
      }

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new IsAbleToWorkPage(formId, _req.body)
      page.validate()

      if (page.hasErrors) {
        return res.render('appointments/update/isAbleToWork', {
          ...page.viewData(appointment),
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)
      await this.appointmentFormService.saveForm(formId, res.locals.user.username, page.updatedFormData(formData))

      return res.redirect(page.nextPath(appointmentId, projectCode))
    }
  }
}
