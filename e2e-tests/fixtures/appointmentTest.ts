import { readDeliusData } from '../delius/deliusTestData'
import test from './test'
import { AppointmentTestOptions } from './testOptions'

export default test.extend<AppointmentTestOptions>({
  // eslint-disable-next-line no-empty-pattern
  testData: async ({}, use) => {
    const testIds = process.env.PW_TESTS?.split(',')
    const index = testIds.findIndex(id => id === test.info().testId)
    const testData = await readDeliusData(index)
    await use(testData)
  },
})
