import type { Reporter, Suite } from '@playwright/test/reporter'
import type { FullConfig } from '@playwright/test'

export default class CountReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    const total = suite.allTests().filter(test => !test.location.file.endsWith('setup.ts')).length
    process.env.PW_TOTAL_TESTS = String(total)
  }

  printsToStdio(): boolean {
    return false
  }
}
