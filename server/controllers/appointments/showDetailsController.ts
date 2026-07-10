import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import { AppointmentParams, GetAppointmentRequest } from '../../@types/user-defined'
import AppointmentShowDetailsPage from '../../pages/appointments/appointmentShowDetailsPage'
import ReferenceDataService from '../../services/referenceDataService'
import setCrnAuditSubject from '../../utils/auditUtils'

export default class ShowDetailsController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly referenceDataService: ReferenceDataService,
  ) {}

  show(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { appointmentId, projectCode } = _req.params as unknown as AppointmentParams

      const request: GetAppointmentRequest = {
        username: res.locals.user.username,
        projectCode,
        appointmentId,
      }

      const appointment = await this.appointmentService.getAppointment(request)

      setCrnAuditSubject(res, appointment.offender.crn)

      const contactOutcome = appointment.contactOutcomeCode
        ? await this.referenceDataService.getContactOutcome(res.locals.user.username, appointment.contactOutcomeCode)
        : undefined

      const page = new AppointmentShowDetailsPage()

      res.render('appointments/show', page.viewData(appointment, contactOutcome))
    }
  }
}
