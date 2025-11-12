import { Router } from 'express'
import paths from '../paths'
import AuditService, { Page } from '../services/auditService'
import type { Controllers } from '../controllers'

export default function appointmentRoutes(
  controllers: Controllers,
  router: Router,
  auditService: AuditService,
): Router {
  const { appointments: { personDetailsController } = {} } = controllers

  router.get(paths.appointments.personDetails.pattern, async (req, res, next) => {
    await auditService.logPageView(Page.APPOINTMENT_PERSON_DETAILS_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    const handler = personDetailsController.show()
    await handler(req, res, next)
  })

  return router
}
