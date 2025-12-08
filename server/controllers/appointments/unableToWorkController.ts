import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import generateErrorSummary from '../../utils/errorUtils'
import paths from '../../paths'
import UnableToWorkPage from '../../pages/appointments/update/unableToWorkPage'
import ReferenceDataService from '../../services/referenceDataService'
import AppointmentStatusService from '../../services/appointmentStatusService'

export default class UnableToWorkController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentStatusService: AppointmentStatusService,
    private readonly referenceDataService: ReferenceDataService,
  ) {}

  show(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const contactOutcomes = await this.referenceDataService.getAttendedNonWorkingContactOutcomes(
        res.locals.user.username,
      )

      const page = new UnableToWorkPage()

      res.render('appointments/update/unableToWork', page.viewData(appointment, contactOutcomes.contactOutcomes))
    }
  }

  submit(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params

      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new UnableToWorkPage(_req.body)
      page.validate()

      if (page.hasErrors) {
        const contactOutcomes = await this.referenceDataService.getAttendedNonWorkingContactOutcomes(
          res.locals.user.username,
        )

        return res.render('appointments/update/unableToWork', {
          ...page.viewData(appointment, contactOutcomes.contactOutcomes),
          ..._req.body,
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      const payload = page.requestBody(appointment)

      await this.appointmentService.saveAppointment({
        username: res.locals.user.name,
        projectCode,
        data: payload,
      })

      this.appointmentStatusService.updateStatus(appointment, 'Cannot work', res.locals.user.name)

      return res.redirect(paths.appointments.confirm.unableToWork({ projectCode, appointmentId }))
    }
  }
}
