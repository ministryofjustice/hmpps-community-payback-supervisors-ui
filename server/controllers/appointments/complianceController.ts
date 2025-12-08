import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import generateErrorSummary from '../../utils/errorUtils'
import { AppointmentCompletedAction, AppointmentParams } from '../../@types/user-defined'
import CompliancePage from '../../pages/appointments/update/compliancePage'
import ReferenceDataService from '../../services/referenceDataService'
import AppointmentStatusService from '../../services/appointmentStatusService'

export default class ComplianceController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentStatusService: AppointmentStatusService,
  ) {}

  show(action: AppointmentCompletedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const appointment = await this.appointmentService.getAppointment({
        ...(_req.params as unknown as AppointmentParams),
        username: res.locals.user.username,
      })

      const page = new CompliancePage(action, {})

      res.render('appointments/update/compliance', page.viewData(appointment))
    }
  }

  submit(action: AppointmentCompletedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const appointmentParams = _req.params as unknown as AppointmentParams
      const appointment = await this.appointmentService.getAppointment({
        ...appointmentParams,
        username: res.locals.user.username,
      })

      const page = new CompliancePage(action, _req.body)
      page.validate()

      if (page.hasErrors) {
        return res.render('appointments/update/compliance', {
          ...page.viewData(appointment),
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      const contactOutcomeCode = action === 'completed' ? ReferenceDataService.attendedCompliedOutcomeCode : ''

      const payload = page.requestBody(appointment, contactOutcomeCode)

      await this.appointmentService.saveAppointment({
        username: res.locals.user.name,
        projectCode: appointmentParams.projectCode,
        data: payload,
      })

      if (action === 'completed') {
        this.appointmentStatusService.updateStatus(appointment, 'Session complete', res.locals.user.name)
      }

      return res.redirect(page.nextPath(appointmentParams.projectCode, appointmentParams.appointmentId))
    }
  }
}
