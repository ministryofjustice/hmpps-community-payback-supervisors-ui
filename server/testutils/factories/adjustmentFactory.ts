import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { AdjustmentDto } from '../../@types/shared'

export default Factory.define<AdjustmentDto>(() => ({
  deliusId: faker.number.int(),
  id: faker.string.alpha(8),
  date: faker.date.recent().toISOString().slice(0, 10),
  amount: faker.string.alpha(8),
  reason: faker.string.alpha(8),
  reasonCode: faker.string.alpha(8),
}))
