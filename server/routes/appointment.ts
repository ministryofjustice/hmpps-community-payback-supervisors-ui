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

  router.get(paths.appointments.startTime.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.APPOINTMENT_START_TIME_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.startTimeController.show()
    await handler(req, res, next)
  })

  router.post(paths.appointments.startTime.pattern, async (req, res, next) => {
    const handler = appointments.startTimeController.submit()
    await handler(req, res, next)
  })

  router.get(paths.appointments.ableToWork.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.APPOINTMENT_ABLE_TO_WORK_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = appointments.ableToWorkController.show()
    await handler(req, res, next)
  })

  return router
}
