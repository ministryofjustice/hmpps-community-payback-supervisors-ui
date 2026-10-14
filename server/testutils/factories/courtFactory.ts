import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { CourtDto } from '../../@types/shared'

export default Factory.define<CourtDto>(() => ({
  code: faker.string.alpha(4),
  description: faker.string.alpha(10),
}))
