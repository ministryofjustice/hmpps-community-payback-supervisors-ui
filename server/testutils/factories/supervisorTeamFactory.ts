import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { SupervisorTeamDto } from '../../@types/shared'
import providerSummaryFactory from './providerSummaryFactory'

export default Factory.define<SupervisorTeamDto>(() => ({
  code: faker.string.alpha(8),
  description: faker.location.city(),
  provider: providerSummaryFactory.build(),
}))
