import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { ProviderTeamSummaryDto } from '../../@types/shared'

export default Factory.define<ProviderTeamSummaryDto>(() => ({
  name: faker.company.name(),
  code: faker.string.alpha(8),
}))
