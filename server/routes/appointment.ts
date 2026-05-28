import { Router } from 'express'
import paths from '../paths'
import AuditService, { Page } from '../services/auditService'
import type { Controllers } from '../controllers'

export default function appointmentRoutes(
  controllers: Controllers,
  router: Router,
  auditService: AuditService,
): Router {
  const { appointments } = controllers

  router.get(paths.appointments.show.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_APPOINTMENT, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.showDetailsController.show()
    await handler(req, res, next)
  })

  router.get(paths.appointments.arrived.startTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_APPOINTMENT_ARRIVED_START_TIME, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.startTimeController.show('arrived')
    await handler(req, res, next)
  })

  router.post(paths.appointments.arrived.startTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.EDIT_APPOINTMENT_ARRIVED_START_TIME, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.startTimeController.submit('arrived')
    await handler(req, res, next)
  })

  router.get(paths.appointments.absent.startTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_APPOINTMENT_ABSENT_START_TIME, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.startTimeController.show('absent')
    await handler(req, res, next)
  })

  router.get(paths.appointments.review.absent.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_REVIEW_APPOINTMENT_ABSENT, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.startTimeController.review('absent')
    await handler(req, res, next)
  })

  router.post(paths.appointments.absent.startTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.EDIT_APPOINTMENT_ABSENT_START_TIME, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.startTimeController.submit('absent')
    await handler(req, res, next)
  })

  router.get(paths.appointments.arrived.isAbleToWork.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_APPOINTMENT_ABLE_TO_WORK, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.isAbleToWorkController.show()
    await handler(req, res, next)
  })

  router.post(paths.appointments.arrived.isAbleToWork.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.CREATE_APPOINTMENT_ABLE_TO_WORK, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.isAbleToWorkController.submit()
    await handler(req, res, next)
  })

  router.get(paths.appointments.arrived.endTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_APPOINTMENT_ARRIVED_END_TIME, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.endTimeController.show('arrived')
    await handler(req, res, next)
  })

  router.post(paths.appointments.arrived.endTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.EDIT_APPOINTMENT_ARRIVED_END_TIME, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.endTimeController.submit('arrived')
    await handler(req, res, next)
  })

  router.get(paths.appointments.arrived.unableToWork.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_APPOINTMENT_UNABLE_TO_WORK, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.unableToWorkController.show()
    await handler(req, res, next)
  })

  router.post(paths.appointments.review.unableToWork.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_REVIEW_APPOINTMENT_UNABLE_TO_WORK, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.unableToWorkController.review()
    await handler(req, res, next)
  })

  router.post(paths.appointments.arrived.unableToWork.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.CREATE_APPOINTMENT_UNABLE_TO_WORK, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.unableToWorkController.submit()
    await handler(req, res, next)
  })

  router.get(paths.appointments.completed.endTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_APPOINTMENT_COMPLETED_END_TIME, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.endTimeController.show('completed')
    await handler(req, res, next)
  })

  router.post(paths.appointments.completed.endTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.EDIT_APPOINTMENT_COMPLETED_END_TIME, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.endTimeController.submit('completed')
    await handler(req, res, next)
  })

  router.get(paths.appointments.completed.compliance.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_APPOINTMENT_COMPLETED_COMPLIANCE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.complianceController.show('completed')
    await handler(req, res, next)
  })

  router.post(paths.appointments.review.completed.compliance.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_REVIEW_APPOINTMENT_COMPLETED_COMPLIANCE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.complianceController.review('completed')
    await handler(req, res, next)
  })

  router.post(paths.appointments.completed.compliance.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.EDIT_APPOINTMENT_COMPLETED_COMPLIANCE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.complianceController.submit('completed')
    await handler(req, res, next)
  })

  router.get(paths.appointments.leftEarly.endTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_APPOINTMENT_LEFT_EARLY_END_TIME, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.endTimeController.show('leftEarly')
    await handler(req, res, next)
  })

  router.post(paths.appointments.leftEarly.endTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.EDIT_APPOINTMENT_LEFT_EARLY_END_TIME, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.endTimeController.submit('leftEarly')
    await handler(req, res, next)
  })

  router.get(paths.appointments.leftEarly.compliance.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_APPOINTMENT_LEFT_EARLY_COMPLIANCE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.complianceController.show('leftEarly')
    await handler(req, res, next)
  })

  router.post(paths.appointments.leftEarly.compliance.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.EDIT_APPOINTMENT_LEFT_EARLY_COMPLIANCE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.complianceController.submit('leftEarly')
    await handler(req, res, next)
  })

  router.get(paths.appointments.leftEarly.reason.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_APPOINTMENT_LEFT_EARLY_REASON, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.leftEarlyReasonController.show()
    await handler(req, res, next)
  })

  router.post(paths.appointments.review.leftEarly.compliance.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_REVIEW_APPOINTMENT_LEFT_EARLY_COMPLIANCE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.complianceController.review('leftEarly')
    await handler(req, res, next)
  })

  router.post(paths.appointments.leftEarly.reason.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.CREATE_APPOINTMENT_LEFT_EARLY_REASON, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.leftEarlyReasonController.submit()
    await handler(req, res, next)
  })

  router.get(paths.appointments.confirm.working.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_CONFIRM_WORKING, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.confirmController.working()
    await handler(req, res, next)
  })

  router.get(paths.appointments.confirm.unableToWork.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_CONFIRM_UNABLE_TO_WORK, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.confirmController.unableToWork()
    await handler(req, res, next)
  })

  router.get(paths.appointments.confirm.absent.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_CONFIRM_ABSENT, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.confirmController.absent()
    await handler(req, res, next)
  })

  router.get(paths.appointments.confirm.completed.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_CONFIRM_COMPLETED, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.confirmController.completed()
    await handler(req, res, next)
  })

  router.get(paths.appointments.confirm.leftEarly.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.VIEW_CONFIRM_LEFT_EARLY, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.confirmController.leftEarly()
    await handler(req, res, next)
  })

  return router
}
