import type { Request, RequestHandler, Response } from 'express'
import AppointmentService from '../../services/appointmentService'
import paths from '../../paths'
import { GetAppointmentRequest } from '../../@types/user-defined'
import Offender from '../../models/offender'

export default class ConfirmController {
  constructor(private readonly appointmentService: AppointmentService) {}

  working(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params

      const request: GetAppointmentRequest = {
        username: res.locals.user.username,
        projectCode,
        appointmentId,
      }

      const appointment = await this.appointmentService.getAppointment(request)
      const { name } = new Offender(appointment.offender)

      res.render('appointments/update/confirm', {
        title: `${name} has been recorded as starting work today`,
        sessionPath: paths.sessions.show({ projectCode: appointment.projectCode, date: appointment.date }),
      })
    }
  }

  unableToWork(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params

      const request: GetAppointmentRequest = {
        username: res.locals.user.username,
        projectCode,
        appointmentId,
      }

      const appointment = await this.appointmentService.getAppointment(request)
      const offender = new Offender(appointment.offender)

      res.render('appointments/update/confirm', {
        offender,
        title: `${offender.name} has been recorded as being unable to work`,
        nextStepsText: `${offender.name}'s probation practioner will be informed about them being unable to work today.`,
        sessionPath: paths.sessions.show({ projectCode: appointment.projectCode, date: appointment.date }),
      })
    }
  }

  absent(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { projectCode, appointmentId } = _req.params

      const request: GetAppointmentRequest = {
        username: res.locals.user.username,
        projectCode,
        appointmentId,
      }

      const appointment = await this.appointmentService.getAppointment(request)
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
      const { projectCode, appointmentId } = _req.params

      const request: GetAppointmentRequest = {
        username: res.locals.user.username,
        projectCode,
        appointmentId,
      }

      const appointment = await this.appointmentService.getAppointment(request)
      const { name } = new Offender(appointment.offender)

      res.render('appointments/update/confirm', {
        title: `${name} session has been completed`,
        sessionPath: paths.sessions.show({ projectCode: appointment.projectCode, date: appointment.date }),
      })
    }
  }
}
