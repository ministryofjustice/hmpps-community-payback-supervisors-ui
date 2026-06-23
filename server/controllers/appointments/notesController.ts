import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import { generateErrorSummary } from '../../utils/errorUtils'
import { AppointmentNotesAction, AppointmentParams } from '../../@types/user-defined'
import AppointmentFormService from '../../services/appointmentFormService'
import NotesPage from '../../pages/appointments/update/notesPage'
import ComplianceReviewPage from '../../pages/appointments/update/complianceReviewPage'
import ReferenceDataService from '../../services/referenceDataService'
import CompliancePage from '../../pages/appointments/update/compliancePage'
import ReviewPage from '../../pages/appointments/update/reviewPage'
import paths from '../../paths'
import { pathWithQuery } from '../../utils/utils'
import { UpdateAppointmentOutcomeDto } from '../../@types/shared/models/UpdateAppointmentOutcomeDto'
import StartTimePage from '../../pages/appointments/update/startTimePage'

export default class NotesController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly referenceDataService: ReferenceDataService,
    private readonly appointmentFormService: AppointmentFormService,
  ) {}

  show(action: AppointmentNotesAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const appointment = await this.appointmentService.getAppointment({
        ...(_req.params as unknown as AppointmentParams),
        username: res.locals.user.username,
      })

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

  review(action: AppointmentNotesAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const formId = _req.query.form?.toString()

      const { projectCode, appointmentId } = _req.params as unknown as AppointmentParams

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

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

      const toSave = notesPage.updateForm(formData)
      await this.appointmentFormService.saveForm(formId, res.locals.user.username, toSave)

      const contactOutcome = await this.referenceDataService.getContactOutcome(
        res.locals.user.username,
        action === 'absent' ? StartTimePage.UnacceptableAbsenceOutcomeCode : formData.contactOutcomeCode,
      )

      if (action === 'absent') {
        const editPath = pathWithQuery(paths.appointments.notes.absent({ projectCode, appointmentId }), {
          form: formId,
        })

        const reviewPage = new ReviewPage(
          'time',
          contactOutcome,
          {
            Notes: _req.body.notes,
            Sensitive: _req.body.isSensitive
              ? 'Cannot be shared with person on probation'
              : 'Can be shared with person on probation',
          },
          true,
          editPath,
        )

        return res.render('appointments/update/review', {
          ...reviewPage.viewData(),
          backPath: editPath,
          updatePath: editPath,
        })
      }

      const editPath = pathWithQuery(paths.appointments.notes.completed({ projectCode, appointmentId }), {
        form: formId,
      })

      const page = new CompliancePage('completed', formId, _req.body)

      const reviewPage = new ComplianceReviewPage(appointment, contactOutcome, formId, formData, _req.body)

      return res.render('appointments/update/review', {
        ...page.viewData(appointment, formData),
        ...reviewPage.viewData(),
        backPath: editPath,
        updatePath: editPath,
      })
    }
  }

  submit(action: AppointmentNotesAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const appointmentParams = { ..._req.params } as unknown as AppointmentParams
      const formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        ...appointmentParams,
        username: res.locals.user.username,
      })

      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)

      const page = new NotesPage({
        action,
        query: _req.body,
        appointment,
      })

      const payload: UpdateAppointmentOutcomeDto = page.buildPayload(appointment, formData)

      await this.appointmentService.saveAppointment({
        username: res.locals.user.username,
        projectCode: appointmentParams.projectCode,
        data: payload,
      })

      return res.redirect(page.nextPath(appointmentParams.projectCode, appointmentParams.appointmentId))
    }
  }
}
