import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import { generateErrorSummary } from '../../utils/errorUtils'
import { AppointmentCompletedAction, AppointmentParams } from '../../@types/user-defined'
import CompliancePage from '../../pages/appointments/update/compliancePage'
import AppointmentStatusService from '../../services/appointmentStatusService'
import ReferenceDataService from '../../services/referenceDataService'
import { notFound } from '../../utils/utils'

type AppointmentParamsWithContactOutcomeCode = AppointmentParams & { contactOutcomeCode: string }

export default class ComplianceController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentStatusService: AppointmentStatusService,
  ) {}

  show(action: AppointmentCompletedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const appointmentParams = _req.params as unknown as AppointmentParamsWithContactOutcomeCode

      if (!ReferenceDataService.validOutcomeCodeForRoute(appointmentParams.contactOutcomeCode, _req.path)) {
        return notFound(res)
      }

      const appointment = await this.appointmentService.getAppointment({
        ...appointmentParams,
        username: res.locals.user.username,
      })

      const page = new CompliancePage(action, {}, appointmentParams.contactOutcomeCode)

      return res.render('appointments/update/compliance', page.viewData(appointment))
    }
  }

  submit(action: AppointmentCompletedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const appointmentParams = _req.params as unknown as AppointmentParamsWithContactOutcomeCode

      const appointment = await this.appointmentService.getAppointment({
        ...appointmentParams,
        username: res.locals.user.username,
      })

      const page = new CompliancePage(action, _req.body, appointmentParams.contactOutcomeCode)
      page.validate()

      if (page.hasErrors) {
        return res.render('appointments/update/compliance', {
          ...page.viewData(appointment),
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      const payload = page.requestBody(appointment)

      await this.appointmentService.saveAppointment({
        username: res.locals.user.name,
        projectCode: appointmentParams.projectCode,
        data: payload,
      })

      const completedStatus = page.completedStatus()

      this.appointmentStatusService.updateStatus(appointment, completedStatus, res.locals.user.name)

      return res.redirect(page.nextPath(appointmentParams.projectCode, appointmentParams.appointmentId))
    }
  }
}
