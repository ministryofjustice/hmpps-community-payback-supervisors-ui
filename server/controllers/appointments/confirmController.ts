import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import paths from '../../paths'
import { AppointmentParams, GetAppointmentRequest } from '../../@types/user-defined'
import Offender from '../../models/offender'
import setCrnAuditSubject from '../../utils/auditUtils'

export default class ConfirmController {
  constructor(private readonly appointmentService: AppointmentService) {}

  absent(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params as unknown as AppointmentParams

      const request: GetAppointmentRequest = {
        username: res.locals.user.username,
        projectCode,
        appointmentId,
      }

      const appointment = await this.appointmentService.getAppointment(request)
      setCrnAuditSubject(res, appointment.offender.crn)

      const offender = new Offender(appointment.offender)

      res.render('appointments/update/confirm', {
        offender,
        title: `${offender.name} has been recorded as absent`,
        nextStepsText: `${offender.name}'s probation practioner will be informed about this absence.`,
        sessionPath: paths.sessions.show({ projectCode: appointment.projectCode, date: appointment.date }),
      })
    }
  }

  completed(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params as unknown as AppointmentParams

      const request: GetAppointmentRequest = {
        username: res.locals.user.username,
        projectCode,
        appointmentId,
      }

      const appointment = await this.appointmentService.getAppointment(request)
      setCrnAuditSubject(res, appointment.offender.crn)

      const { name } = new Offender(appointment.offender)

      res.render('appointments/update/confirm', {
        title: `${name} has completed the session`,
        sessionPath: paths.sessions.show({ projectCode: appointment.projectCode, date: appointment.date }),
      })
    }
  }
}
