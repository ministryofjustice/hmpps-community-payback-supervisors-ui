import type { Request, RequestHandler, Response } from 'express'
import SessionService from '../services/sessionService'
import DateTimeFormats from '../utils/dateTimeUtils'
import LocationUtils from '../utils/locationUtils'
import Offender from '../models/offender'
import paths from '../paths'
import AppointmentStatusService from '../services/appointmentStatusService'
import AppointmentUtils from '../utils/appointmentUtils'

export default class SessionsController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly appointmentStatusService: AppointmentStatusService,
  ) {}

  show(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, date } = _req.params

      const request = {
        username: res.locals.user.username,
        projectCode,
        date: date.toString(),
      }

      const session = await this.sessionService.getSession(request)
      const sesssionStatuses = await this.appointmentStatusService.getStatusesForSession(session, res.locals.user.name)

      const appointmentSummaries = session.appointmentSummaries.map(appointment => {
        const appointmentStatus = sesssionStatuses.find(status => status.appointmentId === appointment.id)

        return {
          ...appointment,
          formattedOffender: new Offender(appointment.offender),
          path: paths.appointments.show({
            projectCode: session.projectCode,
            appointmentId: appointment.id.toString(),
          }),
          statusTag: AppointmentUtils.getStatusTagViewData(appointmentStatus.status),
        }
      })

      res.render('sessions/show', {
        session: {
          ...session,
          appointmentSummaries,
          formattedDate: DateTimeFormats.isoDateToUIDate(session.date),
          formattedLocation: LocationUtils.locationToParagraph(session.location),
        },
      })
    }
  }
}
