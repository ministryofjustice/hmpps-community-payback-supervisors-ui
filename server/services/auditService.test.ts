import AuditService from './auditService'
import AuditClient from '../data/auditClient'

jest.mock('../data/auditClient')

describe('Audit service', () => {
  let auditClient: jest.Mocked<AuditClient>
  let auditService: AuditService

  beforeEach(() => {
    auditClient = new AuditClient(null) as jest.Mocked<AuditClient>
    auditService = new AuditService(auditClient)
  })

  describe('sendAuditMessage', () => {
    it('sends audit message using audit client', async () => {
      await auditService.sendAuditMessage({
        action: 'AUDIT_EVENT',
        username: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })

      expect(auditClient.sendAuditMessage).toHaveBeenCalledWith({
        action: 'AUDIT_EVENT',
        username: 'user1',
        subjectId: 'subject123',
        subjectType: 'exampleType',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })
    })
  })
})
