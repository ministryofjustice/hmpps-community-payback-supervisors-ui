import { expect } from '@playwright/test'
import { describe } from 'node:test'
import idempotencyKey from './restClientUtils'

describe('idempotencyKey', () => {
  it('should return a record with the correct key and value', () => {
    const testCases = [
      { group: 'put-appointment', key: '12345', expectedHeaderValue: 'put-appointment:12345' },
      { group: 'post-adjustment', key: '67890', expectedHeaderValue: 'post-adjustment:67890' },
      {
        group: 'post-course-completion-resolution',
        key: '02468',
        expectedHeaderValue: 'post-course-completion-resolution:02468',
      },
    ]

    testCases.forEach(({ group, key, expectedHeaderValue }) => {
      expect(idempotencyKey(group, key)).toEqual({ 'Idempotency-Key': expectedHeaderValue })
    })
  })
})
