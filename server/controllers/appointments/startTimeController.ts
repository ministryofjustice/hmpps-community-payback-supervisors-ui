import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import StartTimePage from '../../pages/appointments/update/startTimePage'
import { generateErrorSummary } from '../../utils/errorUtils'
import { AppointmentArrivedAction, AppointmentOutcomeForm } from '../../@types/user-defined'
import AppointmentStatusService from '../../services/appointmentStatusService'
import paths from '../../paths'
import { pathWithQuery } from '../../utils/utils'
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
      const formId = _req.query.form?.toString()

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new StartTimePage(action, formId, _req.body)
      const formData = await this.appointmentFormService.getForm(formId, res.locals.user.username)
      page.validate(appointment)
      const pageViewData = page.viewData(appointment, formData)

      if (page.hasErrors) {
        return res.render('appointments/update/time', {
          ...pageViewData,
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      const changeUrl = pathWithQuery(paths.appointments.absent.startTime({ projectCode, appointmentId }), {
        form: formId,
      })

      const reviewPage = new ReviewPage(
        'time',
        'Absent',
        {
          'Start time': { value: pageViewData.time, changeUrl },
          'End time': formData.endTime,
        },
        changeUrl,
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

      const updatedFormData = page.updatedFormData(formData)
      await this.appointmentFormService.saveForm(formId, res.locals.user.username, updatedFormData)

      if (action === 'absent') {
        const payload = page.requestBody(appointment, updatedFormData)

        await this.appointmentService.saveAppointment({
          username: res.locals.user.username,
          projectCode,
          data: payload,
        })

        this.appointmentStatusService.updateStatus(appointment, 'Absent', res.locals.user.username)

        return res.redirect(paths.appointments.confirm.absent({ projectCode, appointmentId }))
      }

      return res.redirect(page.nextPath(appointmentId, projectCode))
    }
  }
}
