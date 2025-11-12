import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { SessionSummaryDto } from '../../@types/shared'

export default Factory.define<SessionSummaryDto>(() => {
  const numberOfOffendersAllocated = faker.number.int({ max: 14 })

  return {
    id: faker.number.int(),
    projectId: faker.number.int(),
    projectCode: faker.string.alpha(10),
    projectName: faker.company.name(),
    date: faker.date.recent().toISOString(),
    startTime: '09:00',
    endTime: '17:00',
    numberOfOffendersAllocated,
    numberOfOffendersWithEA: faker.number.int({ max: numberOfOffendersAllocated }),
    numberOfOffendersWithOutcomes: faker.number.int({ max: numberOfOffendersAllocated }),
  }
})
