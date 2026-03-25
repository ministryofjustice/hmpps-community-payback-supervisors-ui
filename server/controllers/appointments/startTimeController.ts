import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import StartTimePage from '../../pages/appointments/update/startTimePage'
import { generateErrorSummary } from '../../utils/errorUtils'
import { AppointmentArrivedAction, AppointmentOutcomeForm } from '../../@types/user-defined'
import AppointmentStatusService from '../../services/appointmentStatusService'
import paths from '../../paths'
import ReviewPage from '../../pages/appointments/update/reviewPage'
import AppointmentFormService from '../../services/appointmentFormService'

export default class StartTimeController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentStatusService: AppointmentStatusService,
    private readonly appointmentFormService: AppointmentFormService,
  ) {}

  show(action: AppointmentArrivedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params
      let formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      let formData: AppointmentOutcomeForm
      if (formId) {
        // A form might exist if user has navigated back to this page
        formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)
      } else {
        const { data, key } = await this.appointmentFormService.createForm(appointment, res.locals.user.username)
        formData = data
        formId = key.id
      }

      const page = new StartTimePage(action, formId, _req.body, true)

      res.render('appointments/update/time', page.viewData(appointment, formData))
    }
  }

  review(action: AppointmentArrivedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params
      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new StartTimePage(action, _req.body)
      page.validate(appointment)
      const pageViewData = page.viewData(appointment)

      if (page.hasErrors) {
        return res.render('appointments/update/time', {
          ...pageViewData,
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      const reviewPage = new ReviewPage(
        'time',
        'Absent',
        {
          Time: pageViewData.time,
        },
        paths.appointments.absent.startTime({ projectCode, appointmentId }),
      )

      return res.render('appointments/update/review', {
        ...pageViewData,
        ...reviewPage.viewData(),
      })
    }
  }

  submit(action: AppointmentArrivedAction): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params
      const formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new StartTimePage(action, formId, _req.body)
      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)
      page.validate(appointment)

      if (page.hasErrors) {
        return res.render('appointments/update/time', {
          ...page.viewData(appointment, formData),
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      await this.appointmentFormService.saveForm(formId, res.locals.user.username, page.updatedFormData(formData))

      if (action === 'absent') {
        this.appointmentStatusService.updateStatus(appointment, 'Absent', res.locals.user.username)
      }

      return res.redirect(page.nextPath(appointmentId, projectCode))
    }
  }
}
