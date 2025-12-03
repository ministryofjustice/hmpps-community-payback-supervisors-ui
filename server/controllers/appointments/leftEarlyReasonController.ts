import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import generateErrorSummary from '../../utils/errorUtils'
import paths from '../../paths'
import LeftEarlyReasonPage from '../../pages/appointments/update/leftEarlyReasonPage'
import ReferenceDataService from '../../services/referenceDataService'

export default class LeftEarlyReasonController {
  constructor(
    private readonly appointmentService: AppointmentService,
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

      const contactOutcomes = await this.referenceDataService.getContactOutcomesForArrivedUnableToWork(
        res.locals.user.username,
      )

      const page = new LeftEarlyReasonPage()

      res.render('appointments/update/leftEarlyReason', page.viewData(appointment, contactOutcomes.contactOutcomes))
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

      const page = new LeftEarlyReasonPage(_req.body)
      page.validate()

      if (page.hasErrors) {
        const contactOutcomes = await this.referenceDataService.getContactOutcomesForArrivedUnableToWork(
          res.locals.user.username,
        )

        return res.render('appointments/update/leftEarlyReason', {
          ...page.viewData(appointment, contactOutcomes.contactOutcomes),
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      return res.redirect(paths.appointments.confirm.leftEarly({ projectCode, appointmentId }))
    }
  }
}
