import type { Response } from 'express'

const setCrnAuditSubject = (res: Response, crn: string | undefined): void => {
  if (crn) {
    res.locals.audit = {
      subjectType: 'CRN',
      subjectId: crn,
    }
  }
}

export default setCrnAuditSubject
