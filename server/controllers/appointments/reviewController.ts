import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import { catchApiValidationErrorOrPropagate, generateErrorSummary } from '../../utils/errorUtils'
import { AppointmentNotesAction, AppointmentOutcomeForm, AppointmentParams } from '../../@types/user-defined'
import AppointmentFormService from '../../services/appointmentFormService'
import { NotesQuery } from '../../pages/appointments/update/notesPage'
import ComplianceReviewPage from '../../pages/appointments/update/complianceReviewPage'
import ReferenceDataService from '../../services/referenceDataService'
import CompliancePage from '../../pages/appointments/update/compliancePage'
import ReviewPage from '../../pages/appointments/update/reviewPage'
import { AppointmentDto, ContactOutcomeDto } from '../../@types/shared'
import SupervisorService from '../../services/supervisorService'
import setCrnAuditSubject from '../../utils/auditUtils'
import paths from '../../paths'

export default class ReviewController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly referenceDataService: ReferenceDataService,
    private readonly appointmentFormService: AppointmentFormService,
    private readonly supervisorService: SupervisorService,
  ) {}

  show(action: AppointmentNotesAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const formId = _req.query.form?.toString()

      const { projectCode, appointmentId } = _req.params as unknown as AppointmentParams

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      setCrnAuditSubject(res, appointment.offender.crn)

      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)
      const contactOutcome = await this.referenceDataService.getContactOutcome(
        res.locals.user.username,
        action === 'absent' ? ReferenceDataService.UnacceptableAbsenceOutcomeCode : formData.contactOutcomeCode,
      )

      const { reviewPageData } = this.getReviewPageAndViewData(
        action,
        contactOutcome,
        { ..._req.body, form: formId },
        appointment,
        formId,
        formData,
      )

      return res.render('appointments/update/review', reviewPageData)
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

      setCrnAuditSubject(res, appointment.offender.crn)

      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)

      const contactOutcome = await this.referenceDataService.getContactOutcome(
        res.locals.user.username,
        action === 'absent' ? ReferenceDataService.UnacceptableAbsenceOutcomeCode : formData.contactOutcomeCode,
      )

      const { reviewPage, reviewPageData } = this.getReviewPageAndViewData(
        action,
        contactOutcome,
        { ..._req.body, form: formId },
        appointment,
        formId,
        formData,
      )

      const { username } = res.locals.user
      const supervisor = await this.supervisorService.getSupervisor(username)

      reviewPage.validate()

      if (reviewPage.hasErrors) {
        return res.render('appointments/update/review', {
          ...reviewPageData,
          errors: reviewPage.validationErrors,
          errorSummary: generateErrorSummary(reviewPage.validationErrors),
        })
      }

      const payload = reviewPage.buildPayload(appointment, formData, supervisor)
      try {
        await this.appointmentService.saveAppointment({
          username: res.locals.user.username,
          projectCode: appointmentParams.projectCode,
          data: payload,
        })

        return res.redirect(reviewPage.nextPath(appointmentParams.projectCode, appointmentParams.appointmentId))
      } catch (error) {
        return catchApiValidationErrorOrPropagate(
          _req,
          res,
          error,
          paths.sessions.show({ projectCode: appointment.projectCode, date: appointment.date }),
        )
      }
    }
  }

  private getReviewPageAndViewData(
    action: AppointmentNotesAction,
    contactOutcome: ContactOutcomeDto,
    query: NotesQuery,
    appointment: AppointmentDto,
    formId: string,
    formData: AppointmentOutcomeForm,
  ): { reviewPage: ReviewPage; reviewPageData: object } {
    let reviewPage
    let reviewPageData

    if (action === 'absent') {
      reviewPage = new ReviewPage(
        action,
        'time',
        query,
        contactOutcome,
        {
          Notes: formData.notes || '',
          Sensitive: formData.sensitive ? 'Yes' : 'No',
        },
        true,
      )

      reviewPageData = reviewPage.viewData(appointment)
    } else {
      reviewPage = new ComplianceReviewPage(appointment, query, contactOutcome, formData)

      reviewPageData = {
        ...new CompliancePage('completed', formId, {}),
        ...reviewPage.viewData(appointment),
      }
    }

    return {
      reviewPage,
      reviewPageData,
    }
  }
}
