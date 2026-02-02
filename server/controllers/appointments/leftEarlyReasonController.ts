import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import { generateErrorSummary } from '../../utils/errorUtils'
import LeftEarlyReasonPage from '../../pages/appointments/update/leftEarlyReasonPage'
import ReferenceDataService from '../../services/referenceDataService'
import AppointmentFormService from '../../services/appointmentFormService'

export default class LeftEarlyReasonController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly referenceDataService: ReferenceDataService,
    private readonly appointmentFormService: AppointmentFormService,
  ) {}

  show(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params
      const formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const contactOutcomes = await this.referenceDataService.getAttendedNonWorkingContactOutcomes(
        res.locals.user.username,
      )

      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)

      const page = new LeftEarlyReasonPage(formId, {})

      res.render(
        'appointments/update/leftEarlyReason',
        page.viewData(appointment, contactOutcomes.contactOutcomes, formData),
      )
    }
  }

  submit(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params
      const formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new LeftEarlyReasonPage(formId, _req.body)
      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)

      page.validate()

      if (page.hasErrors) {
        const contactOutcomes = await this.referenceDataService.getAttendedNonWorkingContactOutcomes(
          res.locals.user.username,
        )

        return res.render('appointments/update/leftEarlyReason', {
          ...page.viewData(appointment, contactOutcomes.contactOutcomes, formData),
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      await this.appointmentFormService.saveForm(formId, res.locals.user.username, page.updatedFormData(formData))

      return res.redirect(page.nextPath(appointmentId, projectCode))
    }
  }
}
