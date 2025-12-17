import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { ProviderSummaryDto } from '../../@types/shared'

export default Factory.define<ProviderSummaryDto>(() => ({
  code: faker.string.alpha(8),
  name: faker.location.county(),
}))
