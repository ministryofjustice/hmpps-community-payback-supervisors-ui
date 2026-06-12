import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import ReferenceDataService from '../../services/referenceDataService'
import { generateErrorSummary } from '../../utils/errorUtils'
import { AppointmentParams } from '../../@types/user-defined'
import AttendanceOutcomePage from '../../pages/appointments/update/attendanceOutcomePage'
import AppointmentFormService from '../../services/appointmentFormService'

export default class AttendanceOutcomeController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly referenceDataService: ReferenceDataService,
    private readonly appointmentFormService: AppointmentFormService,
  ) {}

  show(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const appointment = await this.appointmentService.getAppointment({
        ...(_req.params as unknown as AppointmentParams),
        username: res.locals.user.username,
      })
      const outcomes = await this.referenceDataService.getContactOutcomes(res.locals.user.username)

      const page = new AttendanceOutcomePage({
        query: _req.query,
        appointment,
        contactOutcomes: outcomes.contactOutcomes,
      })

      if (!page.formId) {
        const { key } = await this.appointmentFormService.createForm(appointment, res.locals.user.username)
        page.formId = key.id
      }

      const form = await this.appointmentFormService.getForm(page.formId, res.locals.user.username)

      res.render('appointments/update/attendanceOutcome', page.viewData(form))
    }
  }

  submit(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const appointmentParams = { ..._req.params } as unknown as AppointmentParams

      const appointment = await this.appointmentService.getAppointment({
        ...appointmentParams,
        username: res.locals.user.username,
      })

      const outcomes = await this.referenceDataService.getContactOutcomes(res.locals.user.username)

      const page = new AttendanceOutcomePage({
        query: _req.body,
        appointment,
        contactOutcomes: outcomes.contactOutcomes,
      })
      const form = await this.appointmentFormService.getForm(page.formId, res.locals.user.username)

      page.validate()

      if (page.hasErrors) {
        return res.render('appointments/update/attendanceOutcome', {
          ...page.viewData(form, true),
          errorSummary: generateErrorSummary(page.validationErrors),
          errors: page.validationErrors,
        })
      }

      const toSave = page.updateForm(form)
      await this.appointmentFormService.saveForm(page.formId, res.locals.user.username, toSave)

      return res.redirect(page.nextPath(appointmentParams.projectCode, appointmentParams.appointmentId))
    }
  }
}
