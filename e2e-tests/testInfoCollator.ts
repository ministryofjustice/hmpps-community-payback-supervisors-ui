import type { Reporter, Suite } from '@playwright/test/reporter'
import type { FullConfig } from '@playwright/test'

export default class TestInfoCollator implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    const tests = suite
      .allTests()
      .filter(test => !test.location.file.endsWith('setup.ts') && test.expectedStatus !== 'skipped')
      .map(test => test.id)
    process.env.PW_TOTAL_TESTS = String(tests.length)
    process.env.PW_TESTS = tests.join(',')
  }

  printsToStdio(): boolean {
    return false
  }
}
