import type { Request, RequestHandler, Response } from 'express'
import SessionService from '../services/sessionService'
import DateTimeFormats from '../utils/dateTimeUtils'
import LocationUtils from '../utils/locationUtils'
import Offender from '../models/offender'
import paths from '../paths'
import AppointmentUtils from '../utils/appointmentUtils'
import AuditService, { Page } from '../services/auditService'

export default class SessionsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly sessionService: SessionService,
  ) {}

  show(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, date } = _req.params as { projectCode: string; date: string }

      const request = {
        username: res.locals.user.username,
        projectCode,
        date: date.toString(),
      }

      const session = await this.sessionService.getSession(request)

      await Promise.all(
        session.appointmentSummaries
          .filter(appointment => appointment.offender.crn)
          .map(appointment =>
            this.auditService.sendAuditMessage({
              action: Page.VIEW_SESSION_APPOINTMENTS,
              username: res.locals.user.username,
              details: _req.params,
              correlationId: _req.id,
              subjectType: 'CRN',
              subjectId: appointment.offender.crn,
            }),
          ),
      )

      const appointmentSummaries = session.appointmentSummaries.map(appointment => {
        return {
          ...appointment,
          formattedOffender: new Offender(appointment.offender),
          path: paths.appointments.show({
            projectCode: session.projectCode,
            appointmentId: appointment.id.toString(),
          }),
          statusTagHtml: AppointmentUtils.buildStatusTag(appointment.contactOutcome),
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
