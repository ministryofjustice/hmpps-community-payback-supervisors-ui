import { Router } from 'express'
import paths from '../paths'
import { Page } from '../services/auditService'
import type { Controllers } from '../controllers'
import { actions } from './utils'

export default function appointmentRoutes(controllers: Controllers, router: Router): Router {
  const { appointments } = controllers
  const { get, post } = actions(router)

  get(paths.appointments.show.pattern, appointments.showDetailsController.show(), {
    auditEvent: Page.VIEW_APPOINTMENT,
  })

  get(paths.appointments.arrived.startTime.pattern, appointments.startTimeController.show('arrived'), {
    auditEvent: Page.VIEW_APPOINTMENT_ARRIVED_START_TIME,
  })

  post(paths.appointments.arrived.startTime.pattern, appointments.startTimeController.submit('arrived'), {
    auditEvent: Page.EDIT_APPOINTMENT_ARRIVED_START_TIME,
  })

  get(paths.appointments.absent.startTime.pattern, appointments.startTimeController.show('absent'), {
    auditEvent: Page.VIEW_APPOINTMENT_ABSENT_START_TIME,
  })

  get(paths.appointments.review.absent.pattern, appointments.startTimeController.review('absent'), {
    auditEvent: Page.VIEW_REVIEW_APPOINTMENT_ABSENT,
  })

  post(paths.appointments.absent.startTime.pattern, appointments.startTimeController.submit('absent'), {
    auditEvent: Page.EDIT_APPOINTMENT_ABSENT_START_TIME,
  })

  get(paths.appointments.arrived.endTime.pattern, appointments.endTimeController.show('arrived'), {
    auditEvent: Page.VIEW_APPOINTMENT_ARRIVED_END_TIME,
  })

  post(paths.appointments.arrived.endTime.pattern, appointments.endTimeController.submit('arrived'), {
    auditEvent: Page.EDIT_APPOINTMENT_ARRIVED_END_TIME,
  })

  get(paths.appointments.completed.endTime.pattern, appointments.endTimeController.show('completed'), {
    auditEvent: Page.VIEW_APPOINTMENT_COMPLETED_END_TIME,
  })

  post(paths.appointments.completed.endTime.pattern, appointments.endTimeController.submit('completed'), {
    auditEvent: Page.EDIT_APPOINTMENT_COMPLETED_END_TIME,
  })

  get(paths.appointments.completed.compliance.pattern, appointments.complianceController.show('completed'), {
    auditEvent: Page.VIEW_APPOINTMENT_COMPLETED_COMPLIANCE,
  })

  post(paths.appointments.review.completed.compliance.pattern, appointments.complianceController.review('completed'), {
    auditEvent: Page.VIEW_REVIEW_APPOINTMENT_COMPLETED_COMPLIANCE,
  })

  post(paths.appointments.completed.compliance.pattern, appointments.complianceController.submit('completed'), {
    auditEvent: Page.EDIT_APPOINTMENT_COMPLETED_COMPLIANCE,
  })

  get(paths.appointments.confirm.absent.pattern, appointments.confirmController.absent(), {
    auditEvent: Page.VIEW_CONFIRM_ABSENT,
  })

  get(paths.appointments.confirm.completed.pattern, appointments.confirmController.completed(), {
    auditEvent: Page.VIEW_CONFIRM_COMPLETED,
  })

  get(paths.appointments.attendanceOutcome.pattern, appointments.attendanceOutcomeController.show(), {
    auditEvent: Page.VIEW_APPOINTMENT_ATTENDANCE_OUTCOME_PAGE,
  })
  post(paths.appointments.attendanceOutcome.pattern, appointments.attendanceOutcomeController.submit(), {
    auditEvent: Page.EDIT_APPOINTMENT_ATTENDANCE_OUTCOME_PAGE,
  })

  return router
}
