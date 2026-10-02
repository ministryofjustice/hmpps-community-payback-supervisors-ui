import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import { AppointmentNotesAction, AppointmentParams } from '../../@types/user-defined'
import AppointmentFormService from '../../services/appointmentFormService'
import NotesPage from '../../pages/appointments/update/notesPage'
import setCrnAuditSubject from '../../utils/auditUtils'
import { generateErrorSummary } from '../../utils/errorUtils'

export default class NotesController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentFormService: AppointmentFormService,
  ) {}

  show(action: AppointmentNotesAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const appointment = await this.appointmentService.getAppointment({
        ...(_req.params as unknown as AppointmentParams),
        username: res.locals.user.username,
      })

      setCrnAuditSubject(res, appointment.offender.crn)

      const page = new NotesPage({
        action,
        query: _req.query,
        appointment,
      })

      if (!page.formId) {
        const { key } = await this.appointmentFormService.createForm(appointment, res.locals.user.username)
        page.formId = key.id
      }

      const formData = await this.appointmentFormService.getForm(page.formId, res.locals.user.username)

      res.render('appointments/update/notes', page.viewData(formData))
    }
  }

  submit(action: AppointmentNotesAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params as unknown as AppointmentParams
      const formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      setCrnAuditSubject(res, appointment.offender.crn)

      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)

      const notesPage = new NotesPage({
        action,
        query: _req.body,
        appointment,
      })

      notesPage.validate()

      if (notesPage.hasErrors) {
        return res.render('appointments/update/notes', {
          ...notesPage.viewData(formData),
          errors: notesPage.validationErrors,
          errorSummary: generateErrorSummary(notesPage.validationErrors),
        })
      }

      await this.appointmentFormService.saveForm(formId, res.locals.user.username, notesPage.updateForm(formData))

      return res.redirect(notesPage.nextPath(projectCode, appointmentId))
    }
  }
}
