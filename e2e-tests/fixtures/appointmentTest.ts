import { readDeliusData } from '../delius/deliusTestData'
import test from './test'
import { AppointmentTestOptions } from './testOptions'

export default test.extend<AppointmentTestOptions>({
  // eslint-disable-next-line no-empty-pattern
  testData: async ({}, use) => {
    const index = test.info().parallelIndex
    const testData = await readDeliusData(index)
    await use(testData)
  },
})
