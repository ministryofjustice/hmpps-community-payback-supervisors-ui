import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { PageMetadata } from '../../@types/shared'

export default Factory.define<PageMetadata>(() => ({
  size: 10,
  number: faker.number.int({ min: 0, max: 5 }),
  totalElements: faker.number.int({ min: 1, max: 50 }),
  totalPages: faker.number.int({ min: 1, max: 6 }),
}))
