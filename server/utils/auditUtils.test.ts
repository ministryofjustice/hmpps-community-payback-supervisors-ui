import { createMock } from '@golevelup/ts-jest'
import type { Response } from 'express'
import setCrnAuditSubject from './auditUtils'

describe('auditUtils', () => {
  describe('setCrnAuditSubject', () => {
    it('sets the audit subject to the given CRN', () => {
      const response = createMock<Response>({ locals: {} })

      setCrnAuditSubject(response, 'X123456')

      expect(response.locals.audit).toEqual({
        subjectType: 'CRN',
        subjectId: 'X123456',
      })
    })

    it('does not set the audit subject if there is no CRN', () => {
      const response = createMock<Response>({ locals: {} })

      setCrnAuditSubject(response, undefined)

      expect(response.locals.audit).toBeUndefined()
    })
  })
})
