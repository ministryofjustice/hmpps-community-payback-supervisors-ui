import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import { generateErrorSummary } from '../../utils/errorUtils'
import { AppointmentEndTimeAction, AppointmentOutcomeForm } from '../../@types/user-defined'
import EndTimePage from '../../pages/appointments/update/endTimePage'
import AppointmentFormService from '../../services/appointmentFormService'
import paths from '../../paths'

export default class EndTimeController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentFormService: AppointmentFormService,
  ) {}

  show(action: AppointmentEndTimeAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params
      let formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      let formData: AppointmentOutcomeForm
      if (formId) {
        // A form might exist if user has navigated back to this page
        formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)
      } else if (action === 'arrived') {
        // For the arrived journey, the form is created on the start time page
        return res.redirect(paths.appointments.arrived.startTime({ projectCode, appointmentId }))
      } else {
        const { data, key } = await this.appointmentFormService.createForm(appointment, res.locals.user.username)
        formData = data
        formId = key.id
      }

      const page = new EndTimePage(action, formId)

      return res.render('appointments/update/time', page.viewData(appointment, formData))
    }
  }

  submit(action: AppointmentEndTimeAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params
      const formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new EndTimePage(action, formId, _req.body)
      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)
      page.validate(appointment)

      if (page.hasErrors) {
        return res.render('appointments/update/time', {
          ...page.viewData(appointment, formData),
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      await this.appointmentFormService.saveForm(formId, res.locals.user.username, page.updatedFormData(formData))

      return res.redirect(page.nextPath(appointmentId, projectCode))
    }
  }
}
