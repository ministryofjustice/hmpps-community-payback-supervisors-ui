import { CPBSupervisorFeatureFlag } from '../@types/feature-flags'

export default class EnvironmentUtils {
  static isFeatureFlagEnabled = (featureFlagName: CPBSupervisorFeatureFlag) => {
    return process.env[featureFlagName] === 'true'
  }
}
