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
    await auditService.logPageView(Page.APPOINTMENT_SHOW_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.showDetailsController.show()
    await handler(req, res, next)
  })

  router.get(paths.appointments.arrived.startTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_APPOINTMENT_ARRIVED_START_TIME_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.startTimeController.show('arrived')
    await handler(req, res, next)
  })

  router.post(paths.appointments.arrived.startTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SUBMIT_APPOINTMENT_ARRIVED_START_TIME_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.startTimeController.submit('arrived')
    await handler(req, res, next)
  })

  router.get(paths.appointments.absent.startTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_APPOINTMENT_ABSENT_START_TIME_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.startTimeController.show('absent')
    await handler(req, res, next)
  })

  router.post(paths.appointments.absent.startTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SUBMIT_APPOINTMENT_ABSENT_START_TIME_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })
    const handler = appointments.startTimeController.submit('absent')
    await handler(req, res, next)
  })

  router.get(paths.appointments.arrived.isAbleToWork.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_APPOINTMENT_ABLE_TO_WORK_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.isAbleToWorkController.show()
    await handler(req, res, next)
  })

  router.post(paths.appointments.arrived.isAbleToWork.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SUBMIT_APPOINTMENT_ABLE_TO_WORK_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.isAbleToWorkController.submit()
    await handler(req, res, next)
  })

  router.get(paths.appointments.arrived.unableToWork.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_APPOINTMENT_UNABLE_TO_WORK_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.unableToWorkController.show()
    await handler(req, res, next)
  })

  router.post(paths.appointments.arrived.unableToWork.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SUBMIT_APPOINTMENT_UNABLE_TO_WORK_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.unableToWorkController.submit()
    await handler(req, res, next)
  })

  router.get(paths.appointments.completed.endTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_APPOINTMENT_COMPLETED_END_TIME_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.endTimeController.show('completed')
    await handler(req, res, next)
  })

  router.post(paths.appointments.completed.endTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SUBMIT_APPOINTMENT_COMPLETED_END_TIME_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.endTimeController.submit('completed')
    await handler(req, res, next)
  })

  router.get(paths.appointments.completed.compliance.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_APPOINTMENT_COMPLETED_COMPLIANCE_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.complianceController.show('completed')
    await handler(req, res, next)
  })

  router.post(paths.appointments.completed.compliance.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SUBMIT_APPOINTMENT_COMPLETED_COMPLIANCE_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.complianceController.submit('completed')
    await handler(req, res, next)
  })

  router.get(paths.appointments.leftEarly.endTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_APPOINTMENT_LEFT_EARLY_END_TIME_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.endTimeController.show('leftEarly')
    await handler(req, res, next)
  })

  router.post(paths.appointments.leftEarly.endTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SUBMIT_APPOINTMENT_LEFT_EARLY_END_TIME_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.endTimeController.submit('leftEarly')
    await handler(req, res, next)
  })

  router.get(paths.appointments.leftEarly.compliance.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_APPOINTMENT_LEFT_EARLY_COMPLIANCE_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.complianceController.show('leftEarly')
    await handler(req, res, next)
  })

  router.post(paths.appointments.leftEarly.compliance.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SUBMIT_APPOINTMENT_LEFT_EARLY_COMPLIANCE_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.complianceController.submit('leftEarly')
    await handler(req, res, next)
  })

  router.get(paths.appointments.confirm.working.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_CONFIRM_WORKING_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.confirmController.working()
    await handler(req, res, next)
  })

  router.get(paths.appointments.confirm.unableToWork.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_CONFIRM_UNABLE_TO_WORK_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.confirmController.unableToWork()
    await handler(req, res, next)
  })

  router.get(paths.appointments.confirm.absent.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_CONFIRM_ABSENT_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.confirmController.absent()
    await handler(req, res, next)
  })

  router.get(paths.appointments.confirm.completed.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_CONFIRM_COMPLETED_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.confirmController.completed()
    await handler(req, res, next)
  })

  router.get(paths.appointments.confirm.leftEarly.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.SHOW_CONFIRM_LEFT_EARLY_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.confirmController.leftEarly()
    await handler(req, res, next)
  })

  return router
}
