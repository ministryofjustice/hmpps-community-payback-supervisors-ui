import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import StartTimePage from '../../pages/appointments/update/startTimePage'
import { generateErrorSummary } from '../../utils/errorUtils'
import { AppointmentArrivedAction, AppointmentOutcomeForm, AppointmentParams } from '../../@types/user-defined'
import paths from '../../paths'
import AppointmentFormService from '../../services/appointmentFormService'
import setCrnAuditSubject from '../../utils/auditUtils'

export default class StartTimeController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentFormService: AppointmentFormService,
  ) {}

  show(action: AppointmentArrivedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params as unknown as AppointmentParams
      let formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      setCrnAuditSubject(res, appointment.offender.crn)

      let formData: AppointmentOutcomeForm
      if (formId) {
        // A form might exist if user has navigated back to this page
        formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)
      } else {
        const { data, key } = await this.appointmentFormService.createForm(appointment, res.locals.user.username)
        formData = data
        formId = key.id
      }

      const page = new StartTimePage(action, formId, _req.body, true)

      res.render('appointments/update/time', page.viewData(appointment, formData))
    }
  }

  submit(action: AppointmentArrivedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params as unknown as AppointmentParams

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      setCrnAuditSubject(res, appointment.offender.crn)

      const formId = _req.query.form?.toString()
      if (!formId) {
        return res.redirect(paths.appointments.arrived.startTime({ projectCode, appointmentId }))
      }

      const page = new StartTimePage(action, formId, _req.body)
      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)
      page.validate(appointment)

      if (page.hasErrors) {
        return res.render('appointments/update/time', {
          ...page.viewData(appointment, formData),
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      const updatedFormData = page.updatedFormData(formData)
      await this.appointmentFormService.saveForm(formId, res.locals.user.username, updatedFormData)

      return res.redirect(page.nextPath(appointmentId, projectCode))
    }
  }
}
