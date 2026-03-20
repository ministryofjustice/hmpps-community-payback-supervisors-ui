import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import { generateErrorSummary } from '../../utils/errorUtils'
import { AppointmentCompletedAction, AppointmentParams } from '../../@types/user-defined'
import CompliancePage from '../../pages/appointments/update/compliancePage'
import AppointmentFormService from '../../services/appointmentFormService'
import ReferenceDataService from '../../services/referenceDataService'
import ComplianceReviewPage from '../../pages/appointments/update/complianceReviewPage'
import AppointmentStatusService from '../../services/appointmentStatusService'

export default class ComplianceController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly referenceDataService: ReferenceDataService,
    private readonly appointmentFormService: AppointmentFormService,
    private readonly appointmentStatusService: AppointmentStatusService,
  ) {}

  show(action: AppointmentCompletedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const appointmentParams = _req.params as unknown as AppointmentParams
      const formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        ...appointmentParams,
        username: res.locals.user.username,
      })

      const page = new CompliancePage(action, formId, {}, true)
      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)

      return res.render('appointments/update/compliance', page.viewData(appointment, formData))
    }
  }

  review(action: AppointmentCompletedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params
      const formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

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

      const contactOutcomes = await this.referenceDataService.getContactOutcomes(res.locals.user.username)
      const reviewPage = new ComplianceReviewPage(action, appointment, contactOutcomes, formId, formData, _req.body)

      return res.render('appointments/update/review', {
        ...page.viewData(appointment, formData),
        ...reviewPage.viewData(),
      })
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

      const page = new CompliancePage(action, formId, _req.body)
      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)

      const payload = page.requestBody(appointment, formData)

      await this.appointmentService.saveAppointment({
        username: res.locals.user.username,
        projectCode: appointmentParams.projectCode,
        data: payload,
      })

      const completedStatus = page.completedStatus()

      this.appointmentStatusService.updateStatus(appointment, completedStatus, res.locals.user.username)

      return res.redirect(page.nextPath(appointmentParams.projectCode, appointmentParams.appointmentId))
    }
  }
}
