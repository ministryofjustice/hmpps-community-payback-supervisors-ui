import EnvironmentUtils from './environmentUtils'

describe('EnvironmentUtils', () => {
  describe('isFeatureFlagEnabled', () => {
    let OLD_ENV: NodeJS.ProcessEnv

    beforeEach(() => {
      OLD_ENV = process.env
    })

    it('should return false if environment variable is not set', () => {
      const result = EnvironmentUtils.isFeatureFlagEnabled('COMMUNITYPAYBACK_SUPERVISOR_ENABLE_CLEAR_SESSION_STATUSES')

      expect(result).toEqual(false)
    })

    it('should return false if environment variable is set to false', () => {
      process.env.COMMUNITYPAYBACK_SUPERVISOR_ENABLE_CLEAR_SESSION_STATUSES = 'false'
      const result = EnvironmentUtils.isFeatureFlagEnabled('COMMUNITYPAYBACK_SUPERVISOR_ENABLE_CLEAR_SESSION_STATUSES')

      expect(result).toEqual(false)
    })

    it('should return true if environment variable is set to true', () => {
      process.env.COMMUNITYPAYBACK_SUPERVISOR_ENABLE_CLEAR_SESSION_STATUSES = 'true'
      const result = EnvironmentUtils.isFeatureFlagEnabled('COMMUNITYPAYBACK_SUPERVISOR_ENABLE_CLEAR_SESSION_STATUSES')

      expect(result).toEqual(true)
    })

    afterEach(() => {
      process.env = OLD_ENV
    })
  })
})
