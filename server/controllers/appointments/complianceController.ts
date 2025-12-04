import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import generateErrorSummary from '../../utils/errorUtils'
import {
  AppointmentCompletedAction,
  AppointmentParams,
} from '../../@types/user-defined'
import CompliancePage from '../../pages/appointments/update/compliancePage'
import ReferenceDataService from '../../services/referenceDataService'

type AppointmentParamsWithContactOutcomeCode = AppointmentParams & { contactOutcomeCode: string }

export default class ComplianceController {
  constructor(private readonly appointmentService: AppointmentService) {}

  show(action: AppointmentCompletedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId, contactOutcomeCode } =
        _req.params as unknown as AppointmentParamsWithContactOutcomeCode

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new CompliancePage(action, {}, contactOutcomeCode)

      res.render('appointments/update/compliance', page.viewData(appointment))
    }
  }

  submit(action: AppointmentCompletedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId, contactOutcomeCode } =
        _req.params as unknown as AppointmentParamsWithContactOutcomeCode

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new CompliancePage(action, _req.body, contactOutcomeCode)
      page.validate()

      if (page.hasErrors) {
        return res.render('appointments/update/compliance', {
          ...page.viewData(appointment),
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      const contactOutcome =
        action === 'completed' ? ReferenceDataService.attendedCompliedOutcomeCode : contactOutcomeCode

      const payload = page.requestBody(appointment, contactOutcome)

      await this.appointmentService.saveAppointment({
        username: res.locals.user.name,
        projectCode,
        data: payload,
      })

      return res.redirect(page.nextPath(projectCode, appointmentId))
    }
  }
}
