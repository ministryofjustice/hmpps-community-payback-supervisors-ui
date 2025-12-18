import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { SupervisorDto } from '../../@types/shared'
import supervisorTeamFactory from './supervisorTeamFactory'

export default Factory.define<SupervisorDto>(() => ({
  code: faker.string.alpha(8),
  isUnpaidWorkTeamMember: true,
  unpaidWorkTeams: supervisorTeamFactory.buildList(1),
}))
