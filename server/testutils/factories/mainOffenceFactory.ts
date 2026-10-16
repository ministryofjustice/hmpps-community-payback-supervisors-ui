import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { MainOffenceDto } from '../../@types/shared'

export default Factory.define<MainOffenceDto>(() => ({
  date: faker.date.recent().toISOString(),
  count: faker.number.int(),
  code: faker.string.alpha(4),
  description: faker.string.alpha(10),
}))
