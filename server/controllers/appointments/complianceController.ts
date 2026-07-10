import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import { generateErrorSummary } from '../../utils/errorUtils'
import { AppointmentCompletedAction, AppointmentParams } from '../../@types/user-defined'
import CompliancePage from '../../pages/appointments/update/compliancePage'
import AppointmentFormService from '../../services/appointmentFormService'
import setCrnAuditSubject from '../../utils/auditUtils'

export default class ComplianceController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentFormService: AppointmentFormService,
  ) {}

  show(action: AppointmentCompletedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const appointmentParams = _req.params as unknown as AppointmentParams
      const formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        ...appointmentParams,
        username: res.locals.user.username,
      })

      setCrnAuditSubject(res, appointment.offender.crn)

      const page = new CompliancePage(action, formId, {})
      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)

      return res.render('appointments/update/compliance', page.viewData(appointment, formData))
    }
  }

  submit(action: AppointmentCompletedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const appointmentParams = _req.params as unknown as AppointmentParams
      const formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        ...appointmentParams,
        username: res.locals.user.username,
      })

      setCrnAuditSubject(res, appointment.offender.crn)

      const page = new CompliancePage(action, formId, _req.body)
      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)

      page.validate()

      if (page.hasErrors) {
        return res.render('appointments/update/compliance', {
          ...page.viewData(appointment, formData),
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      const toSave = page.updateForm(appointment, formData)
      await this.appointmentFormService.saveForm(formId, res.locals.user.username, toSave)

      return res.redirect(page.nextPath(appointmentParams.projectCode, appointmentParams.appointmentId))
    }
  }
}
