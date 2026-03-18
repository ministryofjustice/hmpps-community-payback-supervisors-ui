import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import { generateErrorSummary } from '../../utils/errorUtils'
import paths from '../../paths'
import UnableToWorkPage from '../../pages/appointments/update/unableToWorkPage'
import ReferenceDataService from '../../services/referenceDataService'
import AppointmentStatusService from '../../services/appointmentStatusService'
import ReviewPage from '../../pages/appointments/update/reviewPage'

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

      const page = new UnableToWorkPage(_req.body, true)

      res.render('appointments/update/unableToWork', page.viewData(appointment, contactOutcomes.contactOutcomes))
    }
  }

  review(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params
      const appointment = await this.appointmentService.getAppointment({
        projectCode,
        appointmentId,
        username: res.locals.user.username,
      })

      const page = new UnableToWorkPage(_req.body, false)
      page.validate(appointment)

      const contactOutcomes = await this.referenceDataService.getAttendedNonWorkingContactOutcomes(
        res.locals.user.username,
      )
      if (page.hasErrors) {
        return res.render('appointments/update/unableToWork', {
          ...page.viewData(appointment, contactOutcomes.contactOutcomes),
          ..._req.body,
          errors: page.validationErrors,
          errorSummary: generateErrorSummary(page.validationErrors),
        })
      }

      const reviewData = {
        Attendance: contactOutcomes.contactOutcomes.find(outcome => {
          return outcome.code === _req.body.unableToWork
        }).name,
        Notes: _req.body.notes,
        Sensitivity: _req.body.isSensitive
          ? 'Cannot be shared with person on probation'
          : 'Can be shared with person on probation',
      }

      const reviewPage = new ReviewPage(
        'unableToWork',
        'Cannot work',
        reviewData,
        paths.appointments.arrived.unableToWork({ projectCode, appointmentId }),
      )

      return res.render('appointments/update/review', {
        ...page.viewData(appointment, contactOutcomes.contactOutcomes),
        ...reviewPage.viewData(),
      })
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

      const payload = page.requestBody(appointment)

      await this.appointmentService.saveAppointment({
        username: res.locals.user.username,
        projectCode,
        data: payload,
      })

      this.appointmentStatusService.updateStatus(appointment, 'Cannot work', res.locals.user.username)

      return res.redirect(paths.appointments.confirm.unableToWork({ projectCode, appointmentId }))
    }
  }
}
