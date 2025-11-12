import { Factory } from 'fishery'
import { faker, fakerEN_GB as fakerEngb } from '@faker-js/faker'
import { SessionDto } from '../../@types/shared'
import appointmentSummaryFactory from './appointmentSummaryFactory'
import locationFactory from './locationFactory'

export default Factory.define<SessionDto>(() => ({
  projectCode: faker.string.alpha(10),
  projectName: faker.company.name(),
  projectLocation: fakerEngb.location.county(),
  location: locationFactory.build(),
  date: faker.date.recent().toISOString(),
  startTime: '09:00',
  endTime: '17:00',
  appointmentSummaries: appointmentSummaryFactory.buildList(3),
}))
